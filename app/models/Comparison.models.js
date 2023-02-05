import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Auth',
    },
  },
  { timestamps: true }
);

export const ComparisonModel = mongoose.model('Comparison', schema);
