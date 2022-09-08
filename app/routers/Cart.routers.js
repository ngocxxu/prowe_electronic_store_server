import express from 'express';
import {
  removeAllToCart,
  removeToCart,
  updateToCart,
  addToCart,
  getCart,
} from '../controllers/Cart.controllers.js';

const router = express.Router();

router.get('/:id', getCart);

router.post('/:id', addToCart);

router.put('/:id/items/:idProduct', updateToCart);

router.delete('/:id/items/:idProduct', removeToCart);

router.delete('/:id/items', removeAllToCart);

export default router;