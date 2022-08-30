import express, { response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import products from './app/routers/Product.routers.js';
import user from './app/routers/User.routers.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './development.env' });

const app = express();

const books = [
  { id: 1, name: 'Frontend', author: 'Bono' },
  { id: 2, name: 'Backend', author: 'Poon' },
];

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// app.use('/api/products', products);
// app.use('/api/user', user);

app.get('/books', authenToken, (req, res) => {
  res.json({ status: 'Success', data: books });
});

app.post('/login', (req, res) => {
  // Authentication
  // Tu lam

  // Authorization
  // expiresIn : thoi gian het han cua jwt
  const data = req.body;
  console.log({data})
  const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30s',
  });
  res.json({ accessToken });
});

function authenToken(req, res, next) {
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
}

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
