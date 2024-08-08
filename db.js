const { log } = console;
const { MongoClient } = require("mongodb");
let dbUrl = "mongodb://localhost:27017";
let dbconnection;

module.exports = {
  connectToDb: async (cb) => {
    try {
      const client = await MongoClient.connect(dbUrl);
      dbconnection = client.db("bookstore");
      return cb();
    } catch (error) {
      log(error);
      return cb(error);
    }
  },
  getDb: () => dbconnection,
};
