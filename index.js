var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var dal = require("./dal.js");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// used to serve static files from public directory
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.json());

// create user account
app.post("/account/create", function (req, res) {
  const { name, email, password } = req.body;
  dal.find(email).then((users) => {
    if (users.length > 0) {
      res.status(400).send("User already exists");
    } else {
      dal
        .create(name, email, password)
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(500).send(err));
    }
  });
});

// login user
app.post("/account/login", function (req, res) {
  const { email, password } = req.body;
  dal.find(email).then((user) => {
    if (user.length > 0) {
      if (user[0].password === password) {
        res.status(200).json(user[0]);
      } else {
        res.status(401).send("Login failed: wrong password");
      }
    } else {
      res.status(404).send("Login failed: user not found");
    }
  });
});

// find user account
app.get("/account/find/:email", function (req, res) {
  dal.find(req.params.email).then((user) => {
    if (user.length > 0) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  });
});

// find one user by email - alternative to find
// app.get("/account/findOne/:email", function (req, res) {
//   dal.findOne(req.params.email).then((user) => {
//     console.log(user);
//     res.send(user);
//   });
// });

// update - deposit/withdraw amount
app.post("/account/update/:email/:amount", function (req, res) {
  const { email, amount } = req.params;
  dal.update(email, Number(amount)).then((response) => {
    if (response.value) {
      res.status(200).json(response.value);
    } else {
      res.status(404).send("User not found");
    }
  });
});

// all accounts
app.get("/account/all", function (req, res) {
  dal.all().then((docs) => {
    res.status(200).json(docs);
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

var port = 3000;
app.listen(port);
console.log("Running on port: " + port);
