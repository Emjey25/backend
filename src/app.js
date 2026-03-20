import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import loggerMiddleware from "./middlewares/loggers.js";
import authRoutes from "./routes/index.js";
import huertaRoutes from "./routes/huerta.routes.js";
// import authMiddleware from "./middlewares/auth.middleware.js";


const config = dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
// app.use(authMiddleware); // ESTO ROMPE EL CÓDIGO PORQUE AUTHMIDDLEWARE NO SE EXPORTÓ ASÍ

//rutas públicas
app.use("/api/auth", authRoutes);

// rutas privadas (huertas)
app.use("/api/huertas", huertaRoutes);

// Rutas (aquí irán tus rutas de la API)
app.get("/", (req, res) => {
    res.json({ message: "API funcionando correctamente 🚀" });
});

export default app;
