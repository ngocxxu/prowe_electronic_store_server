import { CartModel } from '../models/Cart.models.js';
import { OrderModel } from '../models/Order.models.js';
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

    // Find idProduct exist in LineItems
    const cart = await CartModel.findOneAndUpdate(
      {
        lineItems: { $elemMatch: { idProduct: req.body.idProduct } },
      },
      {
        $inc: {
          'lineItems.$.subQuantity': +req.body.quantity,
          'lineItems.$.subTotalProduct': +req.body.price,
        },
      }
    );

    

    if (cart === null) {
      const cart = await CartModel.findOneAndUpdate(
        { idCart: req.params.id },
        {
          $push: {
            lineItems: {
              product,
              idProduct: req.body.idProduct,
              subQuantity: req.body.quantity,
              subTotalProduct: req.body.price,
            },
          },
        }
      );
      // const cart = await CartModel.aggregate([
      //   {
      //     $match: { idCart: req.params.id },
      //   },
      //   {
      //     $group: {
      //       _id: req.body.idProduct,
      //       lineItems: {
      //         $push: {
      //           product,
      //           idProduct: req.body.idProduct,
      //           subQuantity: req.body.quantity,
      //           subTotalProduct: req.body.price,
      //         },
      //       },
      //     },
      //   },
      //   { $project : { totalItems : 1 , subTotal : 1 , lineItems: 1 } }
      // ]);
      return res.status(200).json(cart);
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateToCart = async (req, res) => {
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

export const removeToCart = async (req, res) => {
  try {
    const cart = await CartModel.updateOne(
      { idCart: req.params.id },
      {
        $pull: {
          lineItems: {
            idProduct: req.params.idProduct,
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
        $set: {
          lineItems: [],
        },
      }
    );

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
