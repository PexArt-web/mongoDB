const { MongoClient } = require("mongodb");

let dbConnection;
module.exports = {
  connectToDb: async (cb) => {
    try {
        const client = await MongoClient.connect(
          "mongodb://localhost:27017/bookstore",
        );
        dbConnection = client.db('bookstore'); 
        return cb();
      } catch (err) {
        console.log(err);
        return cb(err);
      }
  },
  getDb: () => dbConnection,
};
