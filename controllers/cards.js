const Card = require("../models/card");

const errorMessageGeneralError = 'На сервере произошла ошибка';
const errorMessageWrongData = 'Переданы некорректные данные при создании карточки';
const errorMessageWrongId = 'Карточка с указанным _id не найдена';

const getCards = (req, res) => {
  console.log("getCards req.user._id = "+req.user._id);
  Card.find({})
    .populate('owner')
    .then(cards => res.status(200).send(cards))
    .catch((err) => {
      console.log("getCards error: "+err.name+' - '+err.message);
      return res.status(500).send({message: errorMessageGeneralError});
    });
}

const createCard = (req, res) => {
  console.log("createCard req.user._id = "+req.user._id);
  const newCardData = req.body;
  newCardData.owner = req.user._id;
  console.log(newCardData);
  Card.create(newCardData)
    .then((newCard) => {
      newCard.populate('owner').then (newCard => res.status(201).send(newCard));
    })
    .catch((err) => {
      console.log("createCard error: "+err.name+' - '+err.message);
      if (err.name === "ValidationError") {
        return res.status(400).send({message: errorMessageWrongData});
      }
      return res.status(500).send({message: errorMessageGeneralError});
    });
};

const delCard = (req, res) => {
  console.log("delCard req.params.cardId = "+req.params.cardId);
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send(card))
    .catch((err) => {
      console.log("delCard error: "+err.name+' - '+err.message);
      if (err.name === "CastError") {
        return res.status(404).send({message: errorMessageWrongId});
      }
      return res.status(500).send({message: errorMessageGeneralError});
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true}
  )
    .populate(['owner','likes'])
    .then(card => res.send(card))
    .catch((err) => {
      console.log("likeCard error: "+err.name+' - '+err.message);
      if (err.name === "CastError") {
        return res.status(404).send({message: errorMessageWrongId});
      }
      return res.status(500).send({message: errorMessageGeneralError});
    });
};

const disLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true}
  )
    .populate(['owner','likes'])
    .then(card => res.send(card))
    .catch((err) => {
      console.log("disLikeCard error: "+err.name+' - '+err.message);
      if (err.name === "CastError") {
        return res.status(404).send({message: errorMessageWrongId});
      }
      return res.status(500).send({message: errorMessageGeneralError});
    });
};

module.exports = {
  getCards,
  createCard,
  delCard,
  likeCard,
  disLikeCard
};
