import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      default: 'Bono',
    },
    lastname: {
      type: String,
      default: 'Poon',
    },
    email: {
      type: String,
      default: 'abc@gmail.com',
    },
    phone: {
      type: String,
      default: '0123 456 789',
    },
    password: {
      type: String,
      default: 'ngoc25',
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', schema);
