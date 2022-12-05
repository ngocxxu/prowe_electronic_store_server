import { Cart2Model } from '../models/Cart2.models.js';
import { FavorModel } from '../models/Favor.models.js';
import { ProductModel } from '../models/Product.models.js';

export const getFavor = async (req, res) => {
  try {
    let favor;
    favor = await FavorModel.findOne({ idFavor: req.params.id });

    if (favor) {
      // put minus (-) before _id, __v, idFavor to remove them out of response
      favor = await FavorModel.find({ idFavor: req.params.id })
        .select('-idFavor -_id -__v')
        .populate('product')
        .lean();

      const result = {
        lineItems: favor,
        idFavor: req.params.id,
      };

      return res.status(200).json(result);
    }

    const result = {
      lineItems: [],
      idFavor: req.params.id,
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToFavor = async (req, res) => {
  try {
    const priceProd = await ProductModel.findById(req.body.idProduct);

    let favor;

    favor = await FavorModel.findOneAndUpdate(
      {
        idFavor: req.params.id,
        product: req.body.idProduct,
      },
      {
        $inc: {
          subQuantity: +req.body.quantity,
          subTotalProduct: +priceProd.price.raw,
        },
      }
    );

    if (!favor) {
      favor = new FavorModel({
        idFavor: req.params.id,
        product: req.body.idProduct,
      });
      favor.save();
    }

    res.status(200).json(favor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeToFavor = async (req, res) => {
  try {
    const favor = await FavorModel.findOneAndRemove({
      idFavor: req.params.id,
      product: req.params.idProduct,
    });

    res.status(200).json(favor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeAllFavor = async (req, res) => {
  try {
    const favor = await FavorModel.deleteMany({
      idFavor: req.params.id,
    });

    res.status(200).json(favor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
