import express from 'express';
import protect from '../middleware/authenticationMiddleware';
import { createVaga, deleteVaga, readAllVagas, readVaga, updateVaga } from '../controllers/VagaController';

const router = express.Router();

router.post('/', protect, createVaga);
router.get('/', protect, readAllVagas);
router.get('/:id', protect, readVaga);
router.put('/:id', protect, updateVaga);
router.delete('/:id', protect, deleteVaga);


module.exports = router;