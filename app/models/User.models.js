import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: '',
    },
    firstname: {
      type: String,
      default: '',
    },
    lastname: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', schema);
