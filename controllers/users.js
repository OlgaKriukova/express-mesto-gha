const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const errorMessageGeneralError = 'На сервере произошла ошибка';
const errorMessageWrongData = 'Переданы некорректные данные';
const errorMessageNotFound = 'Пользователь по указанному _id не найден';

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: errorMessageGeneralError }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error(errorMessageNotFound))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === errorMessageNotFound) {
        return res.status(404).send({ message: errorMessageNotFound });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: errorMessageWrongData });
      }
      return res.status(500).send({ message: errorMessageGeneralError });
    });
};

// контроллер login без токена и _id

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // аутентификация успешна
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const createUser = (req, res) => {
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
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(`err.code: ${err.code}`);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: errorMessageWrongData });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Пользователь уже существует' });
      }
      return res.status(500).send({ message: errorMessageGeneralError });
    });
};

const updateUser = (req, res) => {
  const newUserData = req.body;

  User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: errorMessageWrongData });
      }
      return res.status(500).send({ message: errorMessageGeneralError });
    });
};

const updateUserAvatar = (req, res) => {
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: errorMessageWrongData });
      }
      return res.status(500).send({ message: errorMessageGeneralError });
    });
};

module.exports = {
  getUsers,
  getUserById,
  login,
  createUser,
  updateUser,
  updateUserAvatar,
};
