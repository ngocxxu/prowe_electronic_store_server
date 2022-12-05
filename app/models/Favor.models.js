import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    idFavor: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  },
  { timestamps: true }
);

export const FavorModel = mongoose.model('Favor', schema);
