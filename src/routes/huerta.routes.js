import express from 'express';
import { getHuertas, getHuerta, crearHuerta, actualizarHuerta, eliminarHuerta } from '../controllers/huerta.controllers.js';
import { proteger, restringirA } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(proteger);

router.get('/', getHuertas);
router.get('/:id', getHuerta);
router.post('/', restringirA('admin', 'docente'), crearHuerta);
router.put('/:id', restringirA('admin', 'docente'), actualizarHuerta);
router.delete('/:id', restringirA('admin'), eliminarHuerta);

export default router;