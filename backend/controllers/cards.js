const Card = require('../models/card');
const BadRequestError = require('../error_templates/BadRequestError');
const NotFoundError = require('../error_templates/NotFoundError');
const ForbiddenError = require('../error_templates/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOne({ _id: req.params._id })
    .orFail(() => next(new NotFoundError('Карточка с указанным _id не найдена.')))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        return next(new ForbiddenError('Карточка вам не принадлежит - вы не можете удалить ее.'));
      }
      Card.deleteOne(card).then(() => res.status(200).send({ data: card }));
      return next;
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') return next(new NotFoundError('Карточка с указанным _id не найдена.'));
      if (err.name === 'ValidationError' || req.params._id.length !== 24) return next(new BadRequestError('Переданы некорректные данные при удалении карточки.'));
      return next(err);
    });
};

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || req.params._id.length !== 24) return next(new BadRequestError('Переданы некорректные данные при получении карточки.'));
      return next(err);
    });
};

module.exports.setCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.status(200).send({ data: card });
      }
      return next(new NotFoundError('Передан несуществующий _id карточки.'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') return next(new NotFoundError('Переданы некорректные данные для постановки/снятии лайка.'));
      return next(err);
    });
};

module.exports.removeCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.status(200).send({ data: card });
      }
      return next(new NotFoundError('Передан несуществующий _id карточки.'));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') return next(new NotFoundError('Переданы некорректные данные для постановки/снятии лайка.'));
      return next(err);
    });
};
