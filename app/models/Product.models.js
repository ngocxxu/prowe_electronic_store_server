import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Xiaomi Poco F4',
    },
    description: {
      type: String,
      default:
        'Flagship 4nm Snapdragon® 8 Gen 1 Smart 120W HyperCharge 120Hz flat AMOLED display',
    },
    price: {
      raw: {
        type: Number,
        default: 650,
      },
    },
    categories: {
      type: Array,
      default: ['Mobiles', 'Tablets'],
    },
    inventory: {
      type: Number,
      default: 30,
    },
    is: {
      hot: {
        type: Boolean,
        default: false,
      },
      available: {
        type: Boolean,
        default: false,
      },
    },
    image: {
      type: String,
      default:
        'https://specs-tech.com/wp-content/uploads/2021/07/Xiaomi-Poco-F4-2.jpg',
    },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model('Product', schema);
