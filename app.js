const { log } = console;
const express = require("express");
const app = express();
const port = 3000;
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");

app.use(express.json());
// db connection
let db;
connectToDb((error) => {
  if (!error) {
    app.listen(port, () => {
      log("server and database connected");
    });
    db = getDb();
  } else {
    log("error connecting to server and database:", error);
  }
});

// routes

app.get("/books", async (req, res) => {
  const page = req.query.p || 0;
  const bookPerPage = 3;
  let books = [];
  try {
    await db
      .collection("books")
      .find()
      .sort({ author: 1 })
      .skip(page * bookPerPage)
      .limit(bookPerPage)
      .forEach((book) => books.push(book));
    if (books.length) {
      res.status(200).json({ books: books });
    } else {
      return res.status(404).json({ message: "Books not found" });
    }
  } catch (error) {
    log("error getting books:", error);
    res.status(500).json(error);
  }
  // res.json({ message: "Hello, Welcome to Api!" });
});

app.get("/books/:bookId", async (req, res) => {
  if (ObjectId.isValid(req.params.bookId)) {
    try {
      const singleBook = await db
        .collection("books")
        .findOne({ _id: new ObjectId(req.params.bookId) });
      if (!singleBook) {
        return res.status(404).json({ message: "Book not found" });
      } else {
        res.status(200).json(singleBook);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
      log(error);
    }
  } else {
    res.status(500).json({ error: "not a valid book id" });
  }
});

app.post("/books", async (req, res) => {
  const book = req.body;
  try {
    const insertedBook = await db.collection("books").insertMany(book);
    res.status(201).json(insertedBook);
  } catch (error) {
    log("error saving book:" + error.message);
    res.status(500).json({ error: "could not create a new document" });
  }
});

app.delete("/books/:bookId", async (req, res) => {
  if (ObjectId.isValid(req.params.bookId)) {
    try {
      const deleteSingleBook = await db
        .collection("books")
        .deleteOne({ _id: new ObjectId(req.params.bookId) });
      if (!deleteSingleBook) {
        return res
          .status(404)
          .json({ message: "Book marked not deletion not found" });
      } else {
        res.status(200).json(deleteSingleBook);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "could not delete book", error: error.message });
      log(error);
    }
  } else {
    res.status(500).json({ error: "not a valid book id" });
  }
});

app.patch("/books/:bookId", async (req, res) => {
  const update = req.body;
  if (ObjectId.isValid(req.params.bookId)) {
    try {
      const updateBook = await db
        .collection("books")
        .updateOne({ _id: new ObjectId(req.params.bookId) }, { $set: update });
      if (!updateBook) {
        return res
          .status(404)
          .json({ message: "Book marked not deletion not found" });
      } else {
        res.status(200).json(updateBook);
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "could not delete book", error: error.message });
      log(error);
    }
  } else {
    res.status(500).json({ error: "not a valid book id" });
  }
});
