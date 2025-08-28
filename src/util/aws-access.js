const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const ALLOWED_EXTENSIONS = {
  resumes: [".pdf", ".doc", ".docx"],
  cover_letters: [".pdf", ".doc", ".docx"],
  photos: [".jpg", ".jpeg", ".png"],
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function isValidFileType(fileName, folder) {
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  const allowed = ALLOWED_EXTENSIONS[folder];
  return allowed && allowed.includes(ext);
}

function sanitizeFileName(fileName) {
  return fileName.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_\-.]/g, "");
}

// Cliente S3 con credenciales y región
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Generador de nombres de archivo dentro del bucket
function buildS3Key(userEmail, originalName, folder) {
  return `${folder}/user-${userEmail}_${originalName}`;
}

// Subir archivo al bucket S3
async function uploadToS3(buffer, fileName, mimeType, folder, userEmail) {
  console.log("🧪 Entrando a uploadToS3");
  console.log("File:", fileName);
  console.log("Mime:", mimeType);
  console.log("Folder:", folder);
  console.log("User email:", userEmail);

  // Validar tipo de archivo y tamaño antes de subir
  if (!isValidFileType(fileName, folder)) {
    throw new Error(`Invalid file type for ${folder}. Allowed: ${ALLOWED_EXTENSIONS[folder].join(", ")}`);
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File size exceeds 5MB limit`);
  }
  
  const safeFileName = sanitizeFileName(fileName);
  const key = buildS3Key(userEmail, safeFileName, folder);

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

// Eliminar archivo del bucket S3
async function deleteFromS3(fileUrl) {
  const url = new URL(fileUrl);
  const key = decodeURIComponent(url.pathname.replace(/^\/+/, ''));

  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key
  });

  await s3.send(command);
}

// Extraer nombre original desde la URL
function getOriginalFileNameFromUrl(fileUrl, userEmail, folder) {
  try {
    const url = new URL(fileUrl);
    const key = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
    const prefix = `${folder}/user-${userEmail}_`;
    if (key.startsWith(prefix)) {
      return key.slice(prefix.length);
    }
    return null;
  } catch {
    return null;
  }
}

module.exports = {
  uploadToS3,
  deleteFromS3,
  getOriginalFileNameFromUrl
};