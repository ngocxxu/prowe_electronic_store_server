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
    let cart;
    const product = await ProductModel.findOne({ _id: req.body.idProduct });

    // Find idProduct exist in LineItems
    cart = await CartModel.findOneAndUpdate(
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
      cart = await CartModel.findOneAndUpdate(
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

      cart = await CartModel.findOneAndUpdate({ idCart: req.params.id }, [
        { $set: { subTotal: { $sum: '$lineItems.subTotalProduct' } } },
      ]);

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
    }

    cart = await CartModel.findOne({ idCart: req.params.id }).lean();
    const calTotalPrice = cart.lineItems.reduce(
      (a, b) => a + b.subTotalProduct,
      0
    );

    cart.subTotal = calTotalPrice;

    return res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateToCart = async (req, res) => {
  try {
    let cart;

    // Find idProduct exist in LineItems
    cart = await CartModel.findOneAndUpdate(
      {
        lineItems: { $elemMatch: { idProduct: req.body.idProduct } },
      },
      {
        $set: {
          'lineItems.$.subQuantity': req.body.quantity,
        },
        $mul: {
          'lineItems.$.subTotalProduct': req.body.quantity,
        },
      }
    );

    cart = await CartModel.findOne({ idCart: req.params.id }).lean();
    const cartTotalPrice = cart.lineItems.reduce(
      (a, b) => a + b.subTotalProduct,
      0
    );

    cart.subTotal = cartTotalPrice;

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeToCart = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.params.idProduct);
    let cart;
    cart = await CartModel.updateOne(
      { idCart: req.params.id },
      {
        $pull: {
          lineItems: {
            idProduct: req.params.idProduct,
          },
        },
      }
    );

    cart = await CartModel.findOne({ idCart: req.params.id }).lean();
    const cartTotalPrice = cart.lineItems.reduce(
      (a, b) => a + b.subTotalProduct,
      0
    );

    cart.subTotal = cartTotalPrice;

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
