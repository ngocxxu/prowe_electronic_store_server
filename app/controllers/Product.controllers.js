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

export const getProduct = (req, res) => {
  res.send('router success');
};
