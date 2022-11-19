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

    console.log(req.body.quantity);

    // Find idProduct exist in LineItems
    // cart = await CartModel.findOneAndUpdate(
    //   {
    //     lineItems: { $elemMatch: { idProduct: req.body.idProduct } },
    //   },

    //   {
    //     $set: {
    //       'lineItems.$.subQuantity': req.body.quantity,
    //     },
    //   }
    // );

    // cart = await CartModel.aggregate([
    //   {
    //     $match: {
    //       idCart: req.params.id,
    //     },
    //   },
    //   {
    //     $unwind: '$lineItems',
    //   },
    //   {
    //     $set: {
    //       'lineItems.subQuantity': req.body.quantity,
    //     },
    //   },
    //   {
    //     $set: {
    //       'lineItems.subTotalProduct': {
    //         $multiply: [
    //           '$lineItems.subQuantity',
    //           {
    //             $toInt: '$lineItems.product.price.raw',
    //           },
    //         ],
    //       },
    //     },
    //   },
    // ]);

    cart = await CartModel.aggregate([
      {
        $match: {
          idCart: req.params.id,
        },
      },
      {
        $unwind: '$lineItems',
      },
      {
        $set: {
          'lineItems.subQuantity': req.body.quantity,
        },
      },
      {
        $set: {
          'lineItems.subTotalProduct': {
            $multiply: [
              '$lineItems.subQuantity',
              {
                $toInt: '$lineItems.product.price.raw',
              },
            ],
          },
        },
      },
    ]);

    // cart = await CartModel.aggregate([
    //   {
    //     $match: {
    //       lineItems: { $elemMatch: { idProduct: req.body.idProduct } },
    //     },
    //   },
    //   { $unwind: '$lineItems' },
    //   {
    //     $project: {
    //       idCart: 1,
    //       totalItems: 1,
    //       subTotal: 1,
    //       discount: 1,
    //       lineItems: 1,
    //       // 'lineItems.subTotalProduct': {
    //       //   $multiply: ['$lineItems.product.price.raw', req.body.quantity],
    //       // },
    //     },
    //   },

    //   // {
    //   //   $project: {
    //   //     idCart: 1,
    //   //     totalItems: 1,
    //   //     subTotal: 1,
    //   //     discount: 1,
    //   //     lineItems: {
    //   //       $filter: {
    //   //         product,
    //   //         idProduct: req.body.idProduct,
    //   //         subQuantity: req.body.quantity,
    //   //         subTotalProduct: req.body.price,
    //   //       },
    //   //     },
    //   //   },
    //   // },
    //   //   $project: {
    //   //     'lineItems.$.subTotalProduct': {
    //   //       $multiply: ['lineItems.$.price', req.body.quantity],
    //   //     },
    //   //   },
    // ]);

    console.log(cart);

    // cart = await CartModel.findOne({ idCart: req.params.id }).lean();
    // const cartTotalPrice = cart.lineItems.reduce(
    //   (a, b) => a + b.subTotalProduct,
    //   0
    // );

    // cart = await CartModel.findOneAndUpdate(
    //   { idCart: req.params.id },
    //   {
    //     $set: { subTotal: cartTotalPrice },
    //   }
    // );

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeToCart = async (req, res) => {
  try {
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

    cart = await CartModel.findOneAndUpdate(
      { idCart: req.params.id },
      {
        $set: { subTotal: cartTotalPrice },
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
