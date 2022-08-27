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
    sale: {
      type: Number,
      default: 0,
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
      sale: {
        type: Boolean,
        default: false,
      },
    },
    image: {
      main: {
        type: String,
        default:
          'https://specs-tech.com/wp-content/uploads/2021/07/Xiaomi-Poco-F4-2.jpg',
      },
      library: {
        type: Array,
        default: [
          'https://specs-tech.com/wp-content/uploads/2021/07/Xiaomi-Poco-F4-2.jpg',
          'https://m.media-amazon.com/images/I/41T92QRpW-L._AC_SL1001_.jpg',
          'https://m.media-amazon.com/images/I/51Jd+uGiZBL._AC_SL1001_.jpg',
          'https://m.media-amazon.com/images/I/61qC7BIjHiL._AC_SL1001_.jpg',
        ],
      },
    },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model('Product', schema);
