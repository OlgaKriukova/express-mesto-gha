const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, errors, Joi } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');

const errorMessageNotFound = 'resource not found';

const { PORT = 3000 } = process.env;

const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('connected to db');
  });

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(4),
      password: Joi.string().required().min(4),
    }).unknown(true),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().min(10),
      email: Joi.string().required().min(5),
      password: Joi.string().required().min(4),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.use((req, res) => res.status(404).send({ message: errorMessageNotFound }));

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
