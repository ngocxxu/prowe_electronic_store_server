import { CartModel } from '../models/Cart.models.js';
import { ProductModel } from '../models/Product.models.js';

export const getCart = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ idCart: req.params.id });

    if (!cart) {
      const data = new CartModel({
        idCart: req.params.id,
      });
      data.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const addToCart = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ _id: req.body.idProduct });
    const cart = await CartModel.updateOne(
      { idCart: req.params.id },
      {
        $push: {
          lineItems: {
            ...product,
          },
        },
        $set: {
          subTotalProduct: product.price.raw,
        },
      }
    );

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateToCart = (req, res) => {
  res.send('create success');
};

export const removeToCart = async (req, res) => {
  try {
    const cart = await CartModel.updateOne(
      { idCart: req.params.id },
      {
        $pull: {
          lineItems: {
            _id: req.params.idProduct,
          },
        },
      }
    );

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const removeAllCart = async (req, res) => {
  try {
    const cart = await CartModel.updateOne(
      { idCart: req.params.id },
      {
        $pull: {
          lineItems: [],
        },
      }
    );

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
