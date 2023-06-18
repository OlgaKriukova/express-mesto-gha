const router = require("express").Router();
const {
  getCards, createCard, delCard, likeCard, disLikeCard
} = require("../controllers/cards");

router.get("/", getCards);

router.post("/", createCard);

router.delete("/:cardId", delCard);

router.put("/:cardId/likes", likeCard);

router.delete("/:cardId/likes", disLikeCard);

module.exports = router;
