import { Cart2Model } from '../models/Cart2.models.js';
import { ProductModel } from '../models/Product.models.js';

export const getCart = async (req, res) => {
  try {
    let cart;
    cart = await Cart2Model.findOne({ idCart: req.params.id });

    if (cart) {
      // put minus (-) before _id, __v, idCart to remove them out of response
      cart = await Cart2Model.find({ idCart: req.params.id })
        .select('-idCart -_id -__v')
        .populate('product')
        .lean();

      const result = {
        lineItems: cart,
        idCart: req.params.id,
        totalItems: cart.length,
        subTotal: cart.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.subTotalProduct,
          0
        ),
      };

      return res.status(200).json(result);
    }

    const result = {
      lineItems: [],
      idCart: req.params.id,
      totalItems: 0,
      subTotal: 0,
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const priceProd = await ProductModel.findById(req.body.idProduct);

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

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateToCart = async (req, res) => {
  try {
    const priceProd = await ProductModel.findById(req.body.idProduct);

    let cart;

    cart = await Cart2Model.updateOne(
      {
        idCart: req.params.id,
        product: req.body.idProduct,
      },
      [
        {
          $set: {
            subQuantity: req.body.quantity,
          },
        },
        {
          $set: {
            subTotalProduct: {
              $multiply: [
                {
                  $toInt: priceProd.price.raw,
                },
                req.body.quantity,
              ],
            },
          },
        },
      ]
    );

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeToCart = async (req, res) => {
  try {
    const cart = await Cart2Model.findOneAndRemove({
      idCart: req.params.id,
      product: req.params.idProduct,
    });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeAllCart = async (req, res) => {
  try {
    const cart = await Cart2Model.deleteMany({
      idCart: req.params.id,
    });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
