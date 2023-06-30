const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotMatchedError = require('../errors/NotMatchedError');
const NotFoundError = require('../errors/NotFoundError');
const UniqueError = require('../errors/UniqueError');

const errorMessageGeneralError = 'На сервере произошла ошибка';
const errorMessageWrongData = 'Переданы некорректные данные';
const errorMessageNotFound = 'Пользователь по указанному _id не найден';
const errorMessageNotMatched = 'Неправильные почта или пароль';
const errorMessageAlreadyExists = 'Пользователь уже существует';

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.status(200).send({
        token: jwt.sign({ _id: user._id }, 'my-super-secret-key-AA9u$u2MM', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        err = new UniqueError(errorMessageAlreadyExists);
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(errorMessageNotFound))
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(201).send(user))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const newUserData = req.body;

  User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  console.log('-updateUserAvatar-');
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  getUserMe,
  login,
  createUser,
  updateUser,
  updateUserAvatar,
};
