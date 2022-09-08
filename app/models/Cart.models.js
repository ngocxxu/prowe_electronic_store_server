import mongoose from 'mongoose';

const schema = new mongoose.Schema({
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
  lineItems: {
    type: Array,
    default: [],
  },
  discount: {
    type: Array,
    default: [],
  },
  timestamps: true,
});

export const CartModel = mongoose.model('Cart', schema);
