import mongoose from 'mongoose';
import { ProductModel } from './Product.models.js';

const schema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    subQuantity: {
      type: Number,
      default: 1,
    },
    subTotalProduct: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model('Order', schema);
