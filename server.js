// server.js
require("dotenv").config(); // Carga las variables de entorno
const app = require("./app"); // Importa tu aplicación Express

const { getAppDataSource } = require("./src/config/data-source"); // Importa la función de 

const PORT = process.env.PORT || 8080; // Usar el puerto 8080 como fallback (o el 9000 que usabas antes, según prefieras)

async function startServer() {
  try {
    // Espera a que la base de datos se inicialice completamente
    // Esto incluye la creación del esquema 'companies' y la sincronización de TypeORM
    const AppDataSource = await getAppDataSource();

    console.log("✅ Base de datos conectada con TypeORM");

    // Estas líneas ahora se ejecutarán después de que la base de datos esté lista
    console.log(
      "Entidades registradas:",
      AppDataSource.entityMetadatas.map((e) => e.name)
    );

    try {
      const metadata = AppDataSource.getMetadata("User");
      console.log("✅ Metadata de 'User' encontrada:", metadata.tableName);
    } catch (err) {
      console.error(
        "⚠️ No se pudo cargar metadata de 'User':",
        err.message
      );
    }

    // Arranca el servidor **una sola vez** después de que todo esté inicializado
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor Express escuchando en el puerto ${PORT}`);
      console.log(`Acceso al backend en: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error crítico al iniciar el servidor:", err);
    process.exit(1); // Sale del proceso si la base de datos no se inicializa
  }
}

// Llama a la función asíncrona para iniciar el servidor
startServer();
