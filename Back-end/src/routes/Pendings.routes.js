import { Router } from 'express';
import { getPendings, getPendingContractors, getPendingsByContractor } from '../controllers/pendings.controller.js';

const router = Router();

//Obtener todos los pendientes
router.get("/pendientes", getPendings);

//Obtener las contratistas de los pendientes
router.get("/contratistas", getPendingContractors);

//Obtener pendientes por contratista
router.get('/pendientes/:contratista', getPendingsByContractor);

export default router;