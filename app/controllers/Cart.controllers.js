import { CartModel } from '../models/Cart.models.js';
import { Cart2Model } from '../models/Cart2.models.js';
import { ProductModel } from '../models/Product.models.js';

// export const getCart = async (req, res) => {
//   try {
//     let cart;
//     cart = await CartModel.findOne({ idCart: req.params.id });

//     if (!cart) {
//       cart = new CartModel({
//         idCart: req.params.id,
//       });
//       cart.save();
//     }

//     res.status(200).json(cart);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const getCart = async (req, res) => {
  try {
    const priceProd = await ProductModel.findOne({
      idProduct: req.body.idProduct,
    });

    let cart;
    cart = await Cart2Model.findOne({ idCart: req.params.id });

    if (!cart) {
      cart = new Cart2Model({
        idCart: req.params.id,
        product: req.body.idProduct,
        subQuantity: 1,
        subTotalProduct: priceProd.price.raw,
      });
      cart.save();
    }

    // put minus (-) before _id, __v, idCart to remove them out of response
    cart = await Cart2Model.find({ idCart: req.params.id })
      .select('-idCart -_id -__v')
      .populate('product');

    // cart.lean().reduce(
    //   (accumulator, currentValue) => accumulator + currentValue.subTotalProduct,
    //   initialValue
    // ),

    const result = {
      lineItems: cart,
      idCart: req.params.id,
      totalItems: cart.length,
      subTotal: 0,
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const addToCart = async (req, res) => {
//   try {
//     let cart;
//     const product = await ProductModel.findOne({ _id: req.body.idProduct });

//     // Find idProduct exist in LineItems
//     cart = await CartModel.findOneAndUpdate(
//       {
//         lineItems: { $elemMatch: { idProduct: req.body.idProduct } },
//       },
//       {
//         $inc: {
//           'lineItems.$.subQuantity': +req.body.quantity,
//           'lineItems.$.subTotalProduct': +req.body.price,
//         },
//       }
//     );

//     // If product not exist in Cart => push it into Cart
//     if (cart === null) {
//       cart = await CartModel.findOneAndUpdate(
//         { idCart: req.params.id },
//         {
//           $push: {
//             lineItems: {
//               product,
//               idProduct: req.body.idProduct,
//               subQuantity: req.body.quantity,
//               subTotalProduct: req.body.price,
//             },
//           },
//         }
//       );

//       cart = await CartModel.findOneAndUpdate({ idCart: req.params.id }, [
//         { $set: { subTotal: { $sum: '$lineItems.subTotalProduct' } } },
//       ]);
//     }

//     cart = await CartModel.findOne({ idCart: req.params.id }).lean();
//     const calTotalPrice = cart.lineItems.reduce(
//       (a, b) => a + b.subTotalProduct,
//       0
//     );

//     cart.subTotal = calTotalPrice;

//     return res.status(200).json(cart);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const addToCart = async (req, res) => {
  try {
    const priceProd = await ProductModel.findOne({
      idProduct: req.body.idProduct,
    });

    let cart;

    cart = await Cart2Model.findOneAndUpdate(
      {
        idCart: req.params.id,
        product: req.body.idProduct,
      },
      {
        $inc: {
          subQuantity: +req.body.quantity,
          subTotalProduct: +priceProd.price.raw,
        },
      }
    );

    if (!cart) {
      cart = new Cart2Model({
        idCart: req.params.id,
        product: req.body.idProduct,
        subQuantity: 1,
        subTotalProduct: priceProd.price.raw,
      });
      cart.save();
    }

    return res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const updateToCart = async (req, res) => {
//   try {
//     let cart;

//     cart = await CartModel.findOneAndUpdate(
//       {
//         lineItems: { $elemMatch: { idProduct: req.body.idProduct } },
//       },

//       {
//         $set: {
//           'lineItems.$.subQuantity': req.body.quantity,
//         },
//       }
//     );

//     cart = await CartModel.aggregate([
//       {
//         $match: {
//           idCart: req.params.id,
//         },
//       },
//       {
//         $unwind: '$lineItems',
//       },
//       {
//         $set: {
//           'lineItems.subQuantity': req.body.quantity,
//         },
//       },
//       {
//         $set: {
//           'lineItems.subTotalProduct': {
//             $multiply: [
//               '$lineItems.subQuantity',
//               {
//                 $toInt: '$lineItems.product.price.raw',
//               },
//             ],
//           },
//         },
//       },
//       {
//         $set: {
//           subTotal: {
//             $sum: {
//               $multiply: [
//                 '$lineItems.subQuantity',
//                 {
//                   $toInt: '$lineItems.product.price.raw',
//                 },
//               ],
//             },
//           },
//         },
//       },

//       // Convert unwind (object) to array
//       {
//         $set: {
//           lineItems: {
//             $map: {
//               input: ['A'],
//               as: 'el',
//               in: '$lineItems',
//             },
//           },
//         },
//       },
//       { $out: 'carts' },
//     ]);

//     res.status(200).json(cart);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const updateToCart = async (req, res) => {
  try {
    const priceProd = await ProductModel.findOne({
      idProduct: req.body.idProduct,
    });

    let cart;

    cart = await Cart2Model.findOneAndUpdate(
      {
        idCart: req.params.id,
        product: req.body.idProduct,
      },
      {
        subQuantity: req.body.quantity,
      },
      {
        new: true,
      }
    );

    // cart = await Cart2Model.aggregate([
    //   // { $match: { idCart: req.params.id } },
    //   { $match: { idProduct: req.body.idProduct } },
    //   // {
    //   //   $set: {
    //   //     subQuantity: req.body.quantity,
    //   //     subTotalProduct: {
    //   //       $multiply: [
    //   //         {
    //   //           $toInt: priceProd.price.raw,
    //   //         },
    //   //         req.body.quantity,
    //   //       ],
    //   //     },
    //   //   },
    //   // },
    // ]);

    console.log({ cart });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeToCart = async (req, res) => {
  try {
    const cart = await CartModel.aggregate([
      {
        $match: {
          idCart: req.params.id,
        },
      },
      {
        $set: {
          lineItems: {
            $filter: {
              input: '$lineItems',
              as: 'item',
              cond: {
                $ne: ['$$item.idProduct', req.params.idProduct],
              },
            },
          },
        },
      },
      {
        $set: {
          subTotal: {
            $cond: {
              if: ['lineItems', []],
              then: 0,
              else: {
                $sum: {
                  $multiply: [
                    '$lineItems.subQuantity',
                    {
                      $toInt: '$lineItems.product.price.raw',
                    },
                  ],
                },
              },
            },
          },
        },
      },
      { $out: 'carts' },
    ]);

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeAllCart = async (req, res) => {
  try {
    const cart = await CartModel.aggregate([
      { $match: { idCart: req.params.id } },
      {
        $set: {
          lineItems: [],
        },
      },
      {
        $set: {
          subTotal: 0,
        },
      },
      { $out: 'carts' },
    ]);

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
