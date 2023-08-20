const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const isUrl = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2, // минимальная длина имени — 2 символа
      maxlength: 30, // а максимальная — 30 символов
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator: (link) => isUrl(link),
        message: 'Ошибка валидации ссылки',
      }
    },
    owner: {
      type: ObjectId,
      required: true,
      ref: 'user',
    },
    likes: [{
      type: ObjectId,
      default: [],
      ref: 'user',
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);

module.exports = mongoose.model('card', cardSchema);