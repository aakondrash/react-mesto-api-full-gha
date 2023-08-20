const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../error_templates/UnauthorizedError');


module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация.'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'куку');
  } catch (err) {
    // отправим ошибку, если не получилось
    return next(new UnauthorizedError('Ошибка авторизации.'));
  }
  req.user = payload;
  return next();
};