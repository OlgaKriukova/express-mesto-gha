const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError());
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'my-super-secret-key-AA9u$u2MM');
  } catch (err) {
    next(new UnauthorizedError());
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
