import express, { response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import products from './app/routers/Product.routers.js';
import user from './app/routers/User.routers.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './development.env' });
const app = express();

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

let refreshTokens = [];
const users = [
  { id: 1, username: 'bono' },
  { id: 2, username: 'pin' },
];

const books = [
  { id: 1, name: 'Frontend', author: 'Bono' },
  { id: 2, name: 'Backend', author: 'Poon' },
];

app.use('/api/products', products);
app.use('/api/user', user);
app.use('/api/auth', auth);

// app.get('/books', authenToken, (req, res) => {
//   res.json({ status: 'Success', data: books });
// });

// function authenToken(req, res, next) {
//   const authorizationHeader = req.headers['authorization'];

//   // 'Bearer [token]'
//   const token = authorizationHeader.split(' ')[1];
//   if (!token) res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
//     console.log(err, data);
//     if (err) res.sendStatus(403);

//     // Neu co data thi ham next() => /books
//     next();
//   });
// }

// app.post('/refreshToken', (req, res) => {
//   const refreshToken = req.body.token;

//   if (!refreshToken) res.sendStatus(401); // unauthorized
//   if (!refreshTokens.includes(refreshToken)) res.sendStatus(403); // Forbidden

//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
//     console.log(err, data);
//     if (err) res.sendStatus(403);

//     // Nếu bên trên thành công
//     const accessToken = jwt.sign(
//       { username: data.user },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: '30s' }
//     );

//     res.json({ accessToken });
//   });
// });

// app.post('/login', (req, res) => {
//   // Authentication
//   // Tu lam

//   // Authorization
//   // expiresIn : thoi gian het han cua jwt

//   const uname = req.body.username;
//   const user = users.find((user) => user.username === uname);

//   if (!user) return res.sendStatus(401);

//   // const data = req.body;
//   // console.log({ data });
//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: '30s',
//   });
//   const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

//   // Moi lan ng dung login thanh cong thi them vao mảng RT
//   refreshTokens.push(refreshToken);

//   res.json({ accessToken, refreshToken });
// });

// app.post('/logout', (req, res) => {
//   const refreshToken = req.body.token;

//   // Xoa RT hiện tại trong mảng RTs
//   refreshTokens = refreshTokens.filter((r) => r !== refreshToken);

//   res.sendStatus(200);
// });

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
