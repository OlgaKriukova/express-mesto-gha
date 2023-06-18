const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const errorMessageNotFound = 'resource not found';

const { PORT = 3000} = process.env;

const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to db");
  });

app.use((req, res, next) => {
  req.user = {
    _id: '648c6c8547fe7359010a4e19'
  };
  next();
});

app.use("/users", userRoutes);
app.use("/cards", cardRoutes);

app.use((req, res) => {
  return res.status(404).send({message: errorMessageNotFound});
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
