import { CartModel } from '../models/Cart.models.js';

export const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ idCart: req.params.idProduct });

    if (!cart) {
      const data = new CartModel({
        idCart: req.params.idProduct,
      });
      data.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const addToCart = (req, res) => {
  res.send('create success');
};

export const updateToCart = (req, res) => {
  res.send('create success');
};

export const removeToCart = (req, res) => {
  res.send('create success');
};

export const removeAllToCart = (req, res) => {
  res.send('create success');
};
