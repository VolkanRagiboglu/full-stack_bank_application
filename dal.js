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
    const doc = { name, email, password, balance: 0, loggedIn: false }; // Add loggedIn field with default value
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

// set loggedIn flag for user account
function setLoggedIn(email, loggedIn) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    collection.updateOne(
      { email: email },
      { $set: { loggedIn: loggedIn } },
      function (err, result) {
        err ? reject(err) : resolve(result);
      }
    );
  });
}

// set logged off flag for user account
function setLoggedOff(email, loggedIn) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    collection.updateOne(
      { email: email },
      { $set: { loggedIn: loggedIn } },
      function (err, result) {
        err ? reject(err) : resolve(result);
      }
    );
  });
}

// log off user
function logoff(email) {
  console.log("Attempting to log off user with email:", email);
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    collection.updateOne(
      { email: email },
      { $set: { loggedIn: false } },
      function (err, result) {
        if (err) {
          console.error("Error updating loggedIn field:", err);
          reject(err);
        } else {
          console.log("Update result:", result);
          resolve(result);
        }
      }
    );
  });
}

// check logged-in status of user
function checkLoggedInStatus(email) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    collection.findOne(
      { email: email },
      { projection: { loggedIn: 1 } },
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          if (result) {
            resolve(result.loggedIn || false);
          } else {
            resolve(false);
          }
        }
      }
    );
  });
}

module.exports = {
  create,
  find,
  deposit,
  withdraw,
  all,
  del,
  setLoggedIn,
  setLoggedOff,
  logoff,
  checkLoggedInStatus,
};
