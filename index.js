import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { authenToken } from './app/controllers/auth.controllers.js';
import auth from './app/routers/auth.routers.js';
import cart from './app/routers/Cart.routers.js';
import favor from './app/routers/Favor.routers.js';
import products from './app/routers/Product.routers.js';
import user from './app/routers/User.routers.js';
import comment from './app/routers/Comment.routers.js';
dotenv.config({ path: './development.env' });
const app = express();

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

app.use('/api/products', products);
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/cart', authenToken, cart);
app.use('/api/favor', authenToken, favor);
app.use('/api/comment', authenToken, comment);

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to DB');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('err', err);
  });
