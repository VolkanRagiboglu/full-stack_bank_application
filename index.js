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
// create user account
app.post("/account/create/:name/:email/:password", function (req, res) {
  // check if account exists
  dal.find(req.params.email).then((users) => {
    // if user exists, return error message
    if (users.length > 0) {
      console.log("User already in exists");
      res.send("User already in exists");
    } else {
      // else create user
      dal
        .create(req.params.name, req.params.email, req.params.password)
        .then((user) => {
          console.log(user);
          res.send(user);
        });
    }
  });
});

// login user
app.get("/account/login/:email/:password", function (req, res) {
  dal.find(req.params.email).then((user) => {
    if (user.length > 0) {
      if (user[0].password === req.params.password) {
        dal
          .setLoggedIn(user[0].email, true)
          .then(() => {
            res.send(user[0]);
          })
          .catch((error) => {
            console.error("Error setting loggedIn flag:", error);
            res.status(500).send("Internal Server Error");
          });
      } else {
        res.send("Login failed: wrong password");
      }
    } else {
      res.send("Login failed: user not found");
    }
  });
});

// log off user
app.get("/account/logoff/:email", function (req, res) {
  const email = req.params.email;
  dal
    .logoff(email)
    .then(() => {
      res.send("User logged off successfully");
    })
    .catch((error) => {
      console.error("Error setting loggedIn flag:", error);
      res.status(500).send("Internal Server Error");
    });
});

// find user account
app.get("/account/find/:email", function (req, res) {
  dal.find(req.params.email).then((user) => {
    console.log(user);
    res.send(user);
  });
});

// deposit amount to user account
app.post("/account/deposit/:email/:amount", function (req, res) {
  var amount = Number(req.params.amount);

  dal.deposit(req.params.email, amount).then((response) => {
    console.log(response);
    res.send(response);
  });
});

// withdraw amount from user account
app.post("/account/withdraw/:email/:amount", function (req, res) {
  var amount = Number(req.params.amount);

  dal.withdraw(req.params.email, amount).then(
    (user) => {
      console.log(user);
      res.send(user);
    },
    (error) => {
      console.error(error);
      res.status(400).send(error); // Sending error response with 400 status
    }
  );
});

// delete user account
app.delete("/account/delete/:email", function (req, res) {
  const email = req.params.email;

  // Check if the user account exists
  dal
    .find(email)
    .then((user) => {
      if (user.length > 0) {
        // User account found, proceed with deletion
        dal
          .del(email)
          .then(() => {
            res.status(200).send("User account deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting user account:", error);
            res.status(500).send("Internal Server Error");
          });
      } else {
        // User account not found
        res.status(404).send("User account not found");
      }
    })
    .catch((error) => {
      console.error("Error finding user account:", error);
      res.status(500).send("Internal Server Error");
    });
});

// all accounts
app.get("/account/all", function (req, res) {
  dal.all().then((docs) => {
    console.log(docs);
    res.send(docs);
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

var port = 3000;
app.listen(port);
console.log("Running on port: " + port);
