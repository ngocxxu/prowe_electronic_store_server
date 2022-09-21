import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      // lowercase: true
      // min: 1,
      // max: 10,
      // minLength: 8,
      // validate: {
      //   validator: (v) =>
      //     String(v)
      //       .toLowerCase()
      //       .match(
      //         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      //       ),
      //   message: (props) => `${props.value} is not a valid email address`,
      // },
    },
    password: {
      type: String,
      required: true,
    },
    idCart: {
      type: String,
      default: mongoose.Types.ObjectId(),
    },
    idFavor: {
      type: String,
      default: mongoose.Types.ObjectId(),
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    is: {
      delete: {
        type: Boolean,
        default: false,
      },
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
