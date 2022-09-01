import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const AuthModel = mongoose.model('Auth', schema);

const schemaRT = new mongoose.Schema(
  {
    rfToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const RTModel = mongoose.model('RefreshToken', schemaRT);
