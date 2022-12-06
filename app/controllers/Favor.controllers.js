import { FavorModel } from '../models/Favor.models.js';

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
        favorItems: favor,
        idFavor: req.params.id,
      };

      return res.status(200).json(result);
    }

    const result = {
      favorItems: [],
      idFavor: req.params.id,
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToFavor = async (req, res) => {
  try {
    let favor;

    favor = await FavorModel.findOne({
      idFavor: req.params.id,
      product: req.body.idProduct,
    });

    if (!favor) {
      favor = new FavorModel({
        idFavor: req.params.id,
        product: req.body.idProduct,
      });
      favor.save();
    } else {
      return res.status(200).json(favor);
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
