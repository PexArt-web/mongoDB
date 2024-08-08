const express = require("express");
const app = express();
const { connectToDb, getDb } = require("./db");
const port = 3000;

app.use(express.json());

// db connection
let db
connectToDb((err) => {
  if (!err) {
    app.listen(port, () => {
      console.log("server and database connected successfully");
    });
    db = getDb();
  }
});

// routes

app.get("/books", (req, res) => {
  res.json({ message: "Hello, Welcome to Api!" });
});
