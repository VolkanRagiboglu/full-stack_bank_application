const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
let db = null;

// connect to mongo
MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  console.log("Connected successfully to db server");

  // connect to myproject database
  db = client.db("myproject");
});

// create user account
function create(name, email, password) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    const doc = { name, email, password, balance: 0 };
    collection.insertOne(doc, { w: 1 }, function (err, result) {
      err ? reject(err) : resolve(doc);
    });
  });
}

// find user account
function find(email) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .find({ email: email })
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

// deposit amount to user account
function deposit(email, amount) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .findOneAndUpdate(
        { email: email },
        { $inc: { balance: amount } },
        { returnOriginal: false },
        function (err, documents) {
          err ? reject(err) : resolve(documents);
        }
      );
  });
}

// withdraw amount from user account
function withdraw(email, amount) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    collection.findOneAndUpdate(
      { email: email, balance: { $gte: amount } }, // Ensure sufficient balance
      { $inc: { balance: -amount } }, // Subtract amount from balance
      { returnOriginal: false },
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          if (result.value) {
            resolve(result.value);
          } else {
            // User not found or insufficient balance
            reject(
              "User account not found or insufficient balance for withdrawal."
            );
          }
        }
      }
    );
  });
}

// delete user account
function del(email) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .deleteOne({ email: email }, function (err, result) {
        err ? reject(err) : resolve(result.deletedCount);
      });
  });
}

// all users
function all() {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .find({})
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

module.exports = { create, find, deposit, withdraw, all, del };
