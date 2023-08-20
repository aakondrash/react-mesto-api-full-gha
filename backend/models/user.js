const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      minlength: 2, // минимальная длина имени — 2 символа
      maxlength: 30, // а максимальная — 30 символов
      default: 'Жак-Ив Кусто'
    },
    about: {
      type: String,
      required: false,
      minlength: 2, // минимальная длина имени — 2 символа
      maxlength: 30, // а максимальная — 30 символов
      default: 'Исследователь'
    },
    avatar: {
      type: String,
      required: false,
      validate: {
        validator: (avatarLink) => isUrl(avatarLink),
        message: 'Ошибка валидации формата ссылки',
      },
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
    },
    email: {
      type: String,
      required: [true, 'Пожалуйста, введите Ваш e-mail'],
      minlength: 2,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Ошибка валидации формата почты',
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false
    },
  },
);

module.exports = mongoose.model('user', userSchema);