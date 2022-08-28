import { UserModel } from '../models/User.models.js';

export const getAllUsers = async (req, res) => {
  try {
    // const post = new UserModel({});
    // post.save();

    // find() : trả về tất cả các bài post
    const products = await UserModel.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getUser = (req, res) => {
  res.send('router success');
};

export const createUser = (req, res) => {
  res.send('create success');
};
