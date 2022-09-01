import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import CryptoJS from 'crypto-js';
import { AuthModel, RTModel } from '../models/auth.models.js';
dotenv.config({ path: '../../development.env' });

let refreshTokens = [];

export const registerAuth = async (req, res) => {
  try {
    const checkEmail = req.body.email;
    const resultAfterCheck = await AuthModel.findOne({
      email: checkEmail,
    });
    if (resultAfterCheck) {
      return res.status(401).json({ error: 'Your email already existed' });
    }

    const newUser = new AuthModel({
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const loginAuth = async (req, res) => {
  try {
    // Check Email
    const checkEmail = req.body.email;
    const resultAfterCheck = await AuthModel.findOne({
      email: checkEmail,
    });
    if (!resultAfterCheck) {
      return res.status(401).json({ error: 'Your email is wrong' });
    }

    // Check Password
    const originalPassword = CryptoJS.AES.decrypt(
      resultAfterCheck.password,
      process.env.PASS_SEC
    ).toString(CryptoJS.enc.Utf8);

    const inputPassword = req.body.password;
    originalPassword != inputPassword && res.status(401).json('Wrong Password');

    // AT & RT
    const accessToken = jwt.sign(
      {
        _id: resultAfterCheck._id,
        isAdmin: resultAfterCheck.isAdmin,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: '600s',
      }
    );

    const refreshToken = jwt.sign(
      {
        _id: resultAfterCheck._id,
        isAdmin: resultAfterCheck.isAdmin,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '2days',
      }
    );

    // Storage refresh token
    await new RTModel({
      rfToken: refreshToken,
    }).save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const refreshTokenAuth = async (req, res) => {
  try {
    const refreshToken = req.body.token;

    if (!refreshToken) res.sendStatus(401); // unauthorized

    const resultRTAfterCheck = await RTModel.findOne({ rfToken: refreshToken });

    if (!resultRTAfterCheck) res.sendStatus(403); // Forbidden

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      console.log(err, data);
      if (err) res.sendStatus(403);

      // When it success --> create new AT
      const accessToken = jwt.sign(
        { _id: data._id, isAdmin: data.isAdmin },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '600s' }
      );

      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const logoutAuth = async (req, res) => {
  try {
    const refreshToken = req.body.token;

    await RTModel.deleteOne({
      rfToken: refreshToken,
    });

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Check token from client
export const authenToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  // 'Bearer [token]'
  const token = authorizationHeader.split(' ')[1];
  if (!token) res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    console.log(err, data);
    if (err) res.sendStatus(403);

    // Neu co data thi ham next() => /books
    next();
  });
};
