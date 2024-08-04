import express from 'express';
import protect from '../middleware/authenticationMiddleware';
import { createVeiculo, deleteVeiculo, readAllVeiculos, readVeiculo, readVeiculoByUser, updateVeiculo } from '../controllers/VeiculoController';

const router = express.Router()

router.post('/', protect, createVeiculo);
router.get('/', protect, readAllVeiculos);
router.get('/mines/:id', protect, readVeiculo);
router.get('/mines', protect, readVeiculoByUser);
router.get('/:id', protect, readVeiculo);
router.put('/:id', protect, updateVeiculo);
router.delete('/:id', protect, deleteVeiculo);

module.exports = router;