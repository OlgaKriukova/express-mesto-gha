const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserById, getUserMe, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUserMe);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUserById,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }).unknown(true),
  }),
  updateUser,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required(),
    }).unknown(true),
  }),
  updateUserAvatar,
);

module.exports = router;
