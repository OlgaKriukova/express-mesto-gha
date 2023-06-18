const Card = require('../models/card');

const errorMessageGeneralError = 'На сервере произошла ошибка';
const errorMessageWrongData = 'Переданы некорректные данные';
const errorMessageNotFound = 'Карточка с указанным _id не найдена';

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: errorMessageGeneralError }));
};

const createCard = (req, res) => {
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  Card.create(newCardData)
    .then((newCard) => {
      newCard.populate('owner')
        .then((newCardPopulated) => res.status(201).send(newCardPopulated));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: errorMessageWrongData });
      }
      return res.status(500).send({ message: errorMessageGeneralError });
    });
};

const delCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error(errorMessageNotFound))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error(errorMessageNotFound))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
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

const disLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error(errorMessageNotFound))
    .populate(['owner', 'likes'])
    .then((card) => res.send(card))
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

module.exports = {
  getCards,
  createCard,
  delCard,
  likeCard,
  disLikeCard,
};
