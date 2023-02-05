import { AuthModel } from '../models/auth.models.js';
import { ComparisonModel } from '../models/Comparison.models.js';

export const getComparison = async (req, res) => {
  try {
    let comparison;
    comparison = await AuthModel.findOne({ userId: req.params.id });

    if (comparison) {
      comparison = await ComparisonModel.find({ userId: req.params.id })
        .select('-userId -_id -__v')
        .populate('product')
        .lean();

      const result = {
        comparisonItems: comparison,
      };

      return res.status(200).json(result);
    }

    const result = {
      comparisonItems: [],
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addToComparison = async (req, res) => {
  try {
    let comparison;

    comparison = await ComparisonModel.findOne({
      userId: req.body.id,
      product: req.body.idProduct,
    });

    if (!comparison) {
      comparison = new ComparisonModel({
        userId: req.body.id,
        product: req.body.idProduct,
      });
      comparison.save();
    } else {
      return res
        .status(401)
        .json({ error: 'You have added this product to your comparison' });
    }
    res.status(200).json(comparison);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateToComparison = async (req, res) => {
  try {
    const result = await ComparisonModel.findByIdAndUpdate(req.params.id, {
      content: req.body.content,
      rate: req.body.rate,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeToComparison = async (req, res) => {
  try {
    const comparison = await ComparisonModel.findOneAndRemove({
      userId: req.params.id,
      product: req.params.idProduct,
    });

    res.status(200).json(comparison);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
