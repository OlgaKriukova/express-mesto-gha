const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const WrongDataError = require('../errors/WrongDataError');

const errorMessageWrongData = 'Переданы некорректные данные';
const errorMessageNotFound = 'Карточка с указанным _id не найдена';

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  Card.create(newCardData)
    .then((newCard) => {
      newCard.populate('owner')
        .then((newCardPopulated) => res.status(201).send(newCardPopulated));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError(errorMessageWrongData));
      }
      next(err);
    });
};

const delCard = (req, res, next) => {
  Card.findOneAndDelete(
    {
      $and: [
        { _id: req.params.cardId },
        { owner: req.user._id },
      ],
    },
  )
    .orFail(new WrongDataError(errorMessageWrongData))
    .populate(['owner', 'likes'])
    .then((deletedCard) => res.status(200).send(deletedCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError(errorMessageWrongData));
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new WrongDataError(errorMessageWrongData))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError(errorMessageWrongData));
      }
      next(err);
    });
};

const disLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError(errorMessageNotFound))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError(errorMessageWrongData));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  delCard,
  likeCard,
  disLikeCard,
};
