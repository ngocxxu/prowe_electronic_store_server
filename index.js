import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import auth from './app/routers/auth.routers.js';
import products from './app/routers/Product.routers.js';
import user from './app/routers/User.routers.js';
dotenv.config({ path: './development.env' });
const app = express();

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

app.use('/api/products', products);
app.use('/api/user', user);
app.use('/api/auth', auth);

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
