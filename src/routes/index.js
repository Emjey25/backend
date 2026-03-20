import express from "express";
import { registro, login, perfil, actualizarPerfil } from '../controllers/auth.controllers.js';
import { proteger } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', proteger, perfil);
router.put('/perfil', proteger, actualizarPerfil);



export default router;