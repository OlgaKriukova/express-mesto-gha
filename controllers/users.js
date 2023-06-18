const User = require("../models/user");

const errorMessageGeneralError = 'На сервере произошла ошибка';
const errorMessageWrongData = 'Переданы некорректные данные';
const errorMessageNotFound = 'Пользователь по указанному _id не найден';

const getUsers = (req, res) => {
   console.log("getUsers user._id = "+req.user._id);
   User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log("getUsers error: "+err.name+' - '+err.message);
      return res.status(500).send({message: errorMessageGeneralError});
    });
}

const getUserById = (req, res) => {
  console.log("getUserById req.params.userId = "+req.params.userId);
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) return res.status(404).send({message: errorMessageNotFound});
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.log("getUserById error: "+err.name+' - '+err.message);
      if (err.name === "CastError") {
        return res.status(400).send({message: errorMessageWrongData});
      }
      return res.status(500).send({message: errorMessageGeneralError});
    });
};

const createUser = (req, res) => {
  console.log("createUser user._id = "+req.user._id);
  const newUserData = req.body;

  User.create(newUserData)
    .then((newUser) => res.status(201).send(newUser))
    .catch((err) => {
      console.log("createCard error: "+err.name+' - '+err.message);
      if (err.name === "ValidationError") {
        return res.status(400).send({message: errorMessageWrongData});
      }
      return res.status(500).send({message: errorMessageGeneralError});
    });
};

const updateUser = (req, res) => {
  console.log("updateUser user._id = "+req.user._id);
  const newUserData = req.body;

  User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    upsert: false
  })
    .then(user => res.send(user))
    .catch((err) => {
      console.log("updateUser error: "+err.name+' - '+err.message);
      if (err.name === "ValidationError") {
        return res.status(400).send({message: errorMessageWrongData});
        //message: `${Object.values(err.errors).map((err) => err.message).join(", ")}`
      }
      return res.status(500).send({message: errorMessageGeneralError});
    });
};

const updateUserAvatar = (req, res) => {
  const {avatar} = req.body;

  console.log("updateUserAvatar avatar = "+avatar);

  User.findByIdAndUpdate(
    req.user._id,
    {avatar},
    {
      new: true,
      runValidators: true,
      upsert: false
    })
    .then(user => res.send(user))
    .catch((err) => {
      console.log("updateUserAvatar error: "+err.name+' - '+err.message);
      if (err.name === "ValidationError") {
        return res.status(400).send({message: errorMessageWrongData});
      }
      return res.status(500).send({message: errorMessageGeneralError});
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
