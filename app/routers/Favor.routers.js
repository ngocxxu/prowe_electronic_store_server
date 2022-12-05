import express from 'express';
import {
  addToFavor,
  getFavor, removeAllFavor,
  removeToFavor
} from '../controllers/Favor.controllers.js';

const router = express.Router();

router.get('/:id', getFavor);

router.post('/:id', addToFavor);

router.delete('/:id/items/:idProduct', removeToFavor);

router.delete('/:id/items', removeAllFavor);

export default router;
