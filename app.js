const { log } = console
const express = require ('express')
const app = express()
const port = 3000
const { connectToDb, getDb } = require('./db')

app.use(express.json())
// db connection
let db
connectToDb((error)=>{
  if(!error){
    app.listen(port,()=>{
      log('server and database connected')
    })
    db = getDb()
  }else{
    log('error connecting to server and database',error)
  }
})

// routes

app.get("/books", async (req, res) => {
  let books = []
   try {
    await db.collection('books').find().sort({author: 1}).forEach(book => books.push(book) )
    res.status(200).json({books: books})
   } catch (error) {
    log('error getting books:', error)
    res.status(500).json(error)
   }
  // res.json({ message: "Hello, Welcome to Api!" });
});
