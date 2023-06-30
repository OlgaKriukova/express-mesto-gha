const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const NotMatchedError = require('../errors/NotMatchedError');

const errorMessageNotMatched = 'Неправильные почта или пароль';

const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: Schema.Types.String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: Schema.Types.String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: Schema.Types.String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: Schema.Types.String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .orFail(new NotMatchedError(errorMessageNotMatched))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new NotMatchedError(errorMessageNotMatched);
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
