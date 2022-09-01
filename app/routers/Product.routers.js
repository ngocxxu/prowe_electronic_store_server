import express from 'express';
import { authenToken } from '../controllers/auth.controllers.js';
import {
  getAllProducts,
  getProduct,
  createProduct,
} from '../controllers/Product.controllers.js';

const router = express.Router();

router.get('/', authenToken ,getAllProducts);

router.get('/id', getProduct);

router.post('/', createProduct);

export default router;
