const { log } = console;
const express = require("express");
const app = express();
const port = 3000;
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");
const e = require("express");

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
  let books = [];
  try {
     await db
      .collection("books")
      .find()
      .sort({ author: 1 })
      .forEach((book) => books.push(book)); 
      if(books.length){
        res.status(200).json({ books: books });
      }else{
        return res.status(404).json({message:"Books not found"})
       

      }
  } catch (error) {
    log("error getting books:", error);
    res.status(500).json(error);
  }
  // res.json({ message: "Hello, Welcome to Api!" });
});

app.get("/books/:bookId", async (req, res) => {
  if(ObjectId.isValid(req.params.bookId)){
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
  }else{
    res.status(500).json({error: "not a valid book id"})
  }
  
});
