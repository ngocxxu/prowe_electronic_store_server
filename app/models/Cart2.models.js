import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    idCart: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    subTotalProduct: {
      type: Number,
      default: 0,
    },
    subQuantity: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Cart2Model = mongoose.model('Cart2', schema);
