
let refreshTokens = [];
const users = [
  { id: 1, username: 'bono' },
  { id: 2, username: 'pin' },
];

export const loginAuth = async (req, res) => {
  try {
    const uname = req.body.username;
    const user = users.find((user) => user.username === uname);

    if (!user) return res.sendStatus(401);

    // const data = req.body;
    // console.log({ data });
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30s',
    });
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    // Moi lan ng dung login thanh cong thi them vao mảng RT
    refreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const refreshTokenAuth = (req, res) => {
  try {
    const refreshToken = req.body.token;

    if (!refreshToken) res.sendStatus(401); // unauthorized
    if (!refreshTokens.includes(refreshToken)) res.sendStatus(403); // Forbidden

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
      console.log(err, data);
      if (err) res.sendStatus(403);

      // Nếu bên trên thành công
      const accessToken = jwt.sign(
        { username: data.user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }
      );

      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const logoutAuth = (req, res) => {
  try {
    const refreshToken = req.body.token;

    // Xoa RT hiện tại trong mảng RTs
    refreshTokens = refreshTokens.filter((r) => r !== refreshToken);

    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};