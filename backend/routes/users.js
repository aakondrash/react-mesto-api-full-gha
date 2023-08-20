const router = require('express').Router();
const {
  createUser,
  getAllUsers,
  getUserInfo,
  setAvatar,
  setProfile
} = require('../controllers/users');
const { URL_REGEXP_PATTERN } = require('../utils/constants');
const {celebrate, Joi} = require('celebrate');

router.get('/users', getAllUsers);
router.get('/users/me', getUserInfo);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserInfo);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(URL_REGEXP_PATTERN),
  }),
}), setAvatar);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), setProfile);

module.exports = router;