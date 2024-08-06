import express from 'express';
import protect from '../middleware/authenticationMiddleware';
import { createVaga, deleteVaga, desocupar, estacionar, readAllVagas, readVaga, updateVaga } from '../controllers/VagaController';

const router = express.Router();

router.post('/', protect, createVaga);
router.get('/', protect, readAllVagas);
router.get('/:id', protect, readVaga);
router.put('/:id', protect, updateVaga);
router.delete('/:id', protect, deleteVaga);
router.post('/estacionar', protect, estacionar);
router.post('/desocupar', protect, desocupar)


module.exports = router;