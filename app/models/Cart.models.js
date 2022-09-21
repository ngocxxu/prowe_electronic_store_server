import mongoose from 'mongoose';
import { ProductModel } from './Product.models.js';

const schema = new mongoose.Schema(
  {
    idCart: {
      type: String,
      required: true,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    lineItems: Array,
    discount: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export const CartModel = mongoose.model('Cart', schema);
