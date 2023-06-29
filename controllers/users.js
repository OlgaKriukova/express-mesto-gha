const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorHandler = require('../middlewares/errorHandler');

const errorMessageGeneralError = 'На сервере произошла ошибка';
const errorMessageWrongData = 'Переданы некорректные данные';
const errorMessageNotFound = 'Пользователь по указанному _id не найден';
const errorMessageAlreadyExists = 'Пользователь уже существует';
const errorMessageNotMatched = 'Неправильные почта или пароль';

const getUsers = (req, res) => {
  console.log('--getUsers--');
  console.log(req.user);
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => errorHandler);
};

const getUserById = (req, res) => {
  console.log('-getUserById-');
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
      return errorHandler;
    });
};

// контроллер для получения информации о пользователе

const getUserMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(201).send(user))
    .catch(() => errorHandler);
};

// контроллер login без токена и _id

const login = (req, res) => {
  console.log('-login-');
  const { email, password } = req.body;
  console.log(req.body);

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        //return Promise.reject(new Error(errorMessageNotMatched));
        return res.status(403).send({ message: errorMessageNotMatched });
      }
      bcrypt.compare(password, user.password, (err, matched) => {
        if (!matched) {
          return res.status(403).send({ message: 'Неправильный пароль' });
        }

        return res.status(200).send({
          token: jwt.sign({ _id: user._id }, 'my-super-secret-key-AA9u$u2MM', { expiresIn: '7d' }),
        });
      });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const createUser = (req, res) => {
  console.log('-createUser-');
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
    .then((user) => {
      // eslint-disable-next-line no-param-reassign
      // delete user.password;
      console.log({ password, ...user });
      return res.status(201).send(user);
    })
    .catch((err) => {
      console.log(`err.code: ${err.code}`);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: errorMessageWrongData });
      }
      if (err.code === 11000) {
        return res.status(409).send({ message: errorMessageAlreadyExists });
      }
      return errorHandler;
    });
};

const updateUser = (req, res) => {
  console.log('-updateUser-');
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
      return errorHandler;
    });
};

const updateUserAvatar = (req, res) => {
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: errorMessageWrongData });
      }
      return errorHandler;
    });
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
