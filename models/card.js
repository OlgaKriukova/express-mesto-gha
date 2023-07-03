const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /^(https?:\/\/)(www\.)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?#.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [
      {
        type: ObjectId,
        ref: 'user',
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
