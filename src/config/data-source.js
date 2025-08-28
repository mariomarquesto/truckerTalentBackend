// src/config/data-source.js
const { DataSource } = require('typeorm');
require('dotenv').config(); // Asegúrate de cargar tus variables de entorno
const { Client } = require('pg'); // Necesario para la creación explícita del esquema

// Configuración de la base de datos para el cliente 'pg' y TypeORM
const dbConfig = {
    host: process.env.PGHOST,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
};

// --- Definir la instancia de AppDataSource una sola vez al cargar el módulo ---
const AppDataSource = new DataSource({
    type: 'postgres',
    ...dbConfig, // Reutilizamos la configuración de la base de datos
    synchronize: true, // Esto creará/actualizará tablas y tipos de datos basados en tus entidades
    dropSchema: true,  // ¡IMPORTANTE PARA DESARROLLO! Eliminará el esquema existente y lo recreará. ¡Borrará todos tus datos!
    logging: false,    // Deshabilita el logging SQL en consola si no lo necesitas
    entities: [
   
        require('../entities/UserEntity'),
        require('../entities/companyEntity'),
        require('../entities/companyProfileEntity'),
        require('../entities/Content'),
        require('../entities/educationEntity'),
        require('../entities/ExperienceEntity'),
        require('../entities/JobEntity'),
        require('../entities/skillEntity'),
        require('../entities/VerificationCode'),
        require('../entities/ChatRoom'),
        require('../entities/ChatMessage')
        
    ],
    migrations: [],
    subscribers: [],
});

let isInitializing = false; // Bandera para controlar el estado de inicialización

// --- Función asíncrona para inicializar la base de datos completamente ---
async function initializeDatabase() {
    // Si ya está inicializado, no hacer nada y devolver la instancia
    if (AppDataSource.isInitialized) {
        console.log("TypeORM ya inicializado.");
        return AppDataSource;
    }

    // Si ya está en proceso de inicialización, esperar a que termine
    if (isInitializing) {
        console.log("TypeORM inicialización en progreso, esperando...");
        while (isInitializing) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return AppDataSource;
    }

    isInitializing = true; // Marcar que la inicialización ha comenzado

    const client = new Client(dbConfig); // Usamos el cliente 'pg' para la creación del esquema
    try {
        await client.connect();
        // Paso 1: Asegurar que el esquema 'companies' exista ANTES de que TypeORM lo necesite
        await client.query('CREATE SCHEMA IF NOT EXISTS companies;');
        console.log('Esquema "companies" verificado/creado exitosamente (con pg client).');
    } catch (schemaError) {
        // Ignorar el error si el esquema ya existe, de lo contrario, reportarlo
        if (schemaError.code !== '42P06' && schemaError.message !== 'schema "companies" already exists') {
            console.error('❌ Error fatal al verificar/crear el esquema "companies":', schemaError.message);
            isInitializing = false;
            throw schemaError;
        }
    } finally {
        if (client.connected) {
            await client.end();
        }
    }

    try {
        // Paso 2: Inicializar la única instancia de AppDataSource
        await AppDataSource.initialize();
        console.log("Conectado a la base de datos TypeORM.");
        console.log("TypeORM ha sincronizado/verificado el esquema de la base de datos.");
        console.log("✅ Base de datos conectada con TypeORM");
    } catch (error) {
        console.error("❌ Error FATAL al inicializar TypeORM:", error);
        // Si falla la inicialización, es posible que la instancia esté en un estado incorrecto.
        // Podríamos intentar destruirla si es posible, aunque initialize() suele manejarlo.
        throw error;
    } finally {
        isInitializing = false; // Marcar que la inicialización ha terminado
    }
    return AppDataSource;
}

// Exportar una función que devuelve una Promesa para obtener la instancia de AppDataSource
// Esto permite que otros módulos esperen a que la DB esté completamente inicializada.
module.exports = {
    getAppDataSource: initializeDatabase // Exportamos la función de inicialización directamente
};
