import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProduct,
} from '../controllers/Product.controllers.js';

const router = express.Router();

router.get('/', getAllProducts);

router.get('/:id', getProduct);

router.post('/', createProduct);

export default router;
