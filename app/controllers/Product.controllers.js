import { CommentModel } from '../models/Comment.models.js';
import { ProductModel } from '../models/Product.models.js';
import { ObjectId } from 'mongodb';

export const getAllProducts = async (req, res) => {
  try {
    const { priceRange, name, sort } = req.query;
    let products;

    switch (sort) {
      case 'alphabet':
        products = await ProductModel.aggregate([{ $sort: { name: 1 } }]);
        break;
      case 'bestSell':
        products = await ProductModel.aggregate([{ $sort: { 'is.hot': -1 } }]);
        break;
      case 'priceHighLow':
        products = await ProductModel.aggregate([
          { $sort: { 'price.raw': -1 } },
        ]);
        break;
      case 'priceLowHigh':
        products = await ProductModel.aggregate([
          { $sort: { 'price.raw': 1 } },
        ]);
        break;
      case 'dateOldNew':
        products = await ProductModel.aggregate([{ $sort: { createdAt: -1 } }]);
        break;
      case 'dateNewOld':
        products = await ProductModel.aggregate([{ $sort: { createdAt: 1 } }]);
        break;

      default:
        products = await ProductModel.find();
        break;
    }

    if (priceRange) {
      products = await ProductModel.find({
        'price.raw': { $gte: priceRange[0], $lt: priceRange[1] },
      });
    }

    if (name) {
      products = await ProductModel.find({ $text: { $search: name } });
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const isExist = await ProductModel.findById(req.params.id);

    if (!isExist) {
      return res.status(401).json('Wrong IdProduct');
    }

    const result = await CommentModel.aggregate([
      { $match: { product: ObjectId(req.params.id) } },
      {
        $group: {
          _id: null,
          review: {
            $avg: '$rate',
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    const product = await ProductModel.aggregate([
      {
        $match: {
          _id: ObjectId(req.params.id),
        },
      },
      {
        $set: {
          avgReviews: {
            $cond: {
              if: {
                $eq: [result, []],
              },
              then: 0,
              else: result[0]?.review,
            },
          },
        },
      },
    ]);

    res.status(200).json(product[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = (req, res) => {
  res.send('create success');
};
