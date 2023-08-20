const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ConflictError = require('../error_templates/ConflictError');
const BadRequestError = require('../error_templates/BadRequestError');
const NotFoundError = require('../error_templates/NotFoundError');
const UnauthorizedError = require('../error_templates/UnauthorizedError');


module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
      .then(hash => User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then((user) => {
        user = user.toObject();
        delete user.password;
        return res.status(201).send({ data: user });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError('Передан e-mail адрес уже зарегистрированного пользователя.'));
        } else if (err.name === 'ValidationError') {
          return next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        } else {
          return next(err);
        }
      });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
      .then((user) => {
        return res.status(200).send({ data: user });
      })
      .catch((err) => {
        return next(err);
      });
};

module.exports.getUserInfo = (req, res, next) => {
  const id = req.params.userId ? req.params.userId : req.user._id;
  User.findById(id)
      .then((user) => {
        if (!user) return next(new NotFoundError('Пользователь по указанному _id не найден.'));
        return res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError' || err.name === 'CastError') return next(new BadRequestError('Переданы некорректные данные для получения данных пользователя.'));
        return next(err);
      });
};


module.exports.setAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
        req.user._id,
        { avatar },
        { new: true, runValidators: true }
      )
      .then((user) => {
        if (!user) {
          return next(new NotFoundError('Пользователь по указанному _id не найден.'));
        }
        return res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
        return next(err);
      });
};

module.exports.setProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
        req.user._id,
        { name, about },
        { new: true, runValidators: true }
      )
      .then((user) => {
        if (!user) {
          return next(new NotFoundError('Пользователь по указанному _id не найден.'));
        }
        return res.status(200).send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя.'));
        return next(err);
      });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  return User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Переданы неверные логин или пароль.'));
      }

      bcrypt.compare(password, user.password, (err, comparationResult) => {
        if (!comparationResult) {
          return next(new UnauthorizedError('Переданы неверные логин или пароль.'));
        }
        const token = jwt.sign(
          { _id: user._id },
          'куку',
          { expiresIn: '7d' },
        );
        return res.status(200).send({ token });
      });
    })
    .catch(next);
};