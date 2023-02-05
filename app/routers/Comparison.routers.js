import express from 'express';
import {
  removeToComparison,
  updateToComparison,
  addToComparison,
  getComparison,
} from '../controllers/Comparison.controllers.js';

const router = express.Router();

router.get('/:id', getComparison);

router.post('/', addToComparison);

router.put('/:id', updateToComparison);

router.delete('/:id/items/:idProduct', removeToComparison);

export default router;
