import { Router } from 'express';
import { getPendingById, updatePending } from '../controllers/editables.controller.js';

const router = Router();

// Ruta para obtener un pendiente por ID
router.get('/pendiente/:id', getPendingById);

// Ruta para actualizar un pendiente por ID
router.put('/pendiente/:id', updatePending);

export default router;
