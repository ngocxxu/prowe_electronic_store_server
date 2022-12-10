import { ProductModel } from '../models/Product.models.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getProduct = async (req, res) => {
  try {
    const isExist = await ProductModel.findById(req.params.id);

    if (!isExist) {
      return res.status(401).json('Wrong IdProduct');
    }

    const product = await ProductModel.findOne({ _id: req.params.id });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createProduct = (req, res) => {
  res.send('create success');
};
