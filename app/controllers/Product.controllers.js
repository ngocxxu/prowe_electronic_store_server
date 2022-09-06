import { ProductModel } from '../models/Product.models.js';

export const getAllProducts = async (req, res) => {
  try {
    // const post = new ProductModel({});
    // post.save();

    // find() : trả về tất cả các bài post
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getProduct = async (req, res) => {
  try {
    // const isExist = ProductModel.find({ _id: req.params.id }).count() > 0;
    // if (isExist) return res.status(400).json('Not found!');

    const product = await ProductModel.findOne({ _id: req.params.id });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createProduct = (req, res) => {
  res.send('create success');
};
