import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/db/database.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // 1. Conectar a la base de datos
        await connectDB();

        // 2. Iniciar el servidor solo si la BD conectó exitosamente
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

startServer();
