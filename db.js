const { log } = console;
require('dotenv').config()
const { MongoClient } = require("mongodb");
let dbUrl = process.env.MONGO_URL ;
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
