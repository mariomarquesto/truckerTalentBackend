// src/routes/moderationRoutes.js
const express = require('express');
const { AppDataSource } = require('../config/data-source'); // Ruta corregida
const { Content } = require('../entities/Content'); // Importa tu entidad Content

// --- INTEGRACIÓN OPENAI ACTIVADA ---
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// --- FIN INTEGRACIÓN OPENAI ACTIVADA ---

// --- Importa tus middlewares de autenticación y autorización ---
const { authMiddleware } = require('../middleware/authMiddleware'); // Ruta corregida (singular)
const { isModerator } = require('../middleware/authMiddleware'); // Ruta corregida (singular)

// --- Configuración de servicios externos ---
// Asegúrate de tener configurado Cloudinary o AWS S3 para subidas
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer para manejar la subida de archivos
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Almacenar el archivo en memoria para pasarlo a Cloudinary/S3

const router = express.Router();

// --- Funciones de Moderación ---

/**
 * Función para moderar texto usando la API de OpenAI.
 * @param {string} text El texto a moderar.
 * @returns {Promise<object>} Los resultados de la moderación de OpenAI.
 */
async function moderateTextWithOpenAI(text) {
    try {
        const response = await openai.moderations.create({
            input: text,
        });
        return response.results[0]; // Retorna el primer resultado de moderación
    } catch (error) {
        console.error('Error al moderar texto con OpenAI:', error.message);
        // En caso de error, marcar como "requiere revisión manual"
        return { flagged: true, categories: { openai_api_error: true }, category_scores: { error: 1 } };
    }
}

/**
 * Función de filtro de palabras clave simple.
 * @param {string} text El texto a revisar.
 * @returns {boolean} True si se encuentra una palabra clave prohibida, false en caso contrario.
 */
function simpleKeywordFilter(text) {
    const prohibitedKeywords = ['palabra_prohibida_1', 'sexo', 'odio', 'matar', 'spam', 'estafa'];
    const lowerCaseText = text.toLowerCase();
    for (const keyword of prohibitedKeywords) {
        if (lowerCaseText.includes(keyword)) {
            console.log(`Filtro de palabras clave: "${keyword}" detectada en el texto.`);
            return true;
        }
    }
    return false;
}

// --- Rutas de la API de Moderación ---

/**
 * @route POST /api/moderation/text
 * @desc Sube y modera contenido de texto.
 * @access Private (Requiere autenticación)
 */
router.post('/text', authMiddleware, async (req, res) => {
    const { text, contentType = 'text' } = req.body;
    const userId = req.user ? req.user.id : 'anonymous_user';

    if (!text) {
        return res.status(400).json({ message: 'El campo "text" es requerido.' });
    }

    const contentRepository = AppDataSource.getRepository(Content);

    try {
        if (simpleKeywordFilter(text)) {
            const newContent = contentRepository.create({
                userId,
                contentType: contentType,
                content: text,
                moderationStatus: 'rejected',
                moderationDetails: { reason: 'keyword_violation', flaggedBy: 'simple_filter' }
            });
            await contentRepository.save(newContent);
            return res.status(403).json({
                message: 'Contenido rechazado debido a palabras clave prohibidas.',
                status: 'rejected',
                details: newContent
            });
        }

        const openaiModerationResult = await moderateTextWithOpenAI(text);
        let moderationStatus = 'approved';
        let moderationDetails = { ...openaiModerationResult };

        if (openaiModerationResult.flagged) {
            moderationStatus = 'manual_review';
            console.log(`OpenAI ha marcado contenido como ${JSON.stringify(openaiModerationResult.categories)}. Enviando a revisión manual.`);
        }

        const newContent = contentRepository.create({
            userId,
            contentType: contentType,
            content: text,
            moderationStatus: moderationStatus,
            moderationDetails: moderationDetails
        });

        await contentRepository.save(newContent);

        res.status(200).json({
            message: 'Contenido recibido y en proceso de moderación.',
            status: moderationStatus,
            details: newContent
        });

    } catch (error) {
        console.error('Error al procesar la solicitud de moderación de texto:', error);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
});

/**
 * @route POST /api/moderation/image
 * @desc Sube una imagen y la envía a moderación.
 * @access Private (Requiere autenticación)
 */
router.post('/image', authMiddleware, upload.single('image'), async (req, res) => {
    const userId = req.user ? req.user.id : 'anonymous_user';
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No se ha proporcionado ningún archivo de imagen.' });
    }

    const contentRepository = AppDataSource.getRepository(Content);

    try {
        const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) throw new Error('Error al subir imagen a Cloudinary: ' + error.message);
            return result;
        }).end(file.buffer);

        const imageUrl = result.secure_url;

        let moderationStatus = 'manual_review';
        let moderationDetails = {
            uploadedTo: 'cloudinary',
            imageUrl: imageUrl,
        };

        const newImageContent = contentRepository.create({
            userId,
            contentType: 'image',
            content: imageUrl,
            moderationStatus: moderationStatus,
            moderationDetails: moderationDetails
        });
        await contentRepository.save(newImageContent);

        res.status(200).json({
            message: 'Imagen subida y enviada a moderación. Pendiente de revisión.',
            status: moderationStatus,
            details: newImageContent
        });

    } catch (error) {
        console.error('Error al subir o procesar imagen:', error.message);
        res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
});

/**
 * @route GET /api/moderation/content/:id
 * @desc Obtiene un contenido específico por su ID.
 * @access Private (Requiere autenticación, opcionalmente autorización para moderadores)
 */
router.get('/content/:id', authMiddleware, async (req, res) => {
    const contentRepository = AppDataSource.getRepository(Content);
    try {
        const content = await contentRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!content) {
            return res.status(404).json({ message: 'Contenido no encontrado.' });
        }
        res.status(200).json(content);
    } catch (error) {
        console.error('Error al obtener contenido:', error.message);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

/**
 * @route PUT /api/moderation/content/:id/status
 * @desc Actualiza el estado de moderación de un contenido (para moderadores humanos).
 * @access Private (Requiere autenticación y autorización de moderador)
 */
router.put('/content/:id/status', authMiddleware, isModerator, async (req, res) => {
    const { status, reason } = req.body;
    const validStatuses = ['approved', 'rejected', 'manual_review'];

    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Estado de moderación inválido.' });
    }

    const contentRepository = AppDataSource.getRepository(Content);

    try {
        const contentToUpdate = await contentRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!contentToUpdate) {
            return res.status(404).json({ message: 'Contenido no encontrado.' });
        }

        contentToUpdate.moderationStatus = status;
        contentToUpdate.moderationDetails = { ...contentToUpdate.moderationDetails, manualReason: reason || 'N/A', moderatedBy: req.user ? req.user.id : 'unknown' };
        contentToUpdate.updatedAt = new Date();

        await contentRepository.save(contentToUpdate);
        res.status(200).json({ message: 'Estado de moderación actualizado.', content: contentToUpdate });

    } catch (error) {
        console.error('Error al actualizar el estado de moderación:', error.message);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
});

module.exports = router;
