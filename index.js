const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zmlpw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=>{
  res.send('it is working')
})

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const eventCollection = client.db("nature").collection("picture");
  const productCollection = client.db("nature").collection("checkOut");
  console.log("connected successfully");

  app.get("/events", (req, res) => {
    eventCollection.find().toArray((err, items) => {
      console.log(items);
      res.send(items);
    });
  });

  app.get("/event/:_id", (req, res) => {
    eventCollection
      .find({ _id: ObjectID(req.params._id) })
      .toArray((err, items) => {
        console.log(items);
        res.send(items);
      });
  });

  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    console.log("event", newEvent);
    eventCollection.insertOne(newEvent).then((result) => {
      console.log(result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  });


  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    console.log("event", newProduct);
    productCollection.insertOne(newProduct).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });


  app.get("/products", (req, res) => {
    productCollection.find({email: req.query.email})
    .toArray((err, items) => {
      console.log(items);
      res.send(items);
    });
  });

  app.delete("/delete/:id", (req, res)=>{
    console.log(req.params.id)
    eventCollection.deleteOne({_id: ObjectID(req.params.id)})
    .then(result =>{
      console.log(result)
   })
})

  app.delete("/remove/:id", (req, res)=>{
    console.log(req.params.id)
    productCollection.deleteOne({_id: (req.params.id)})
    .then(result =>{
    console.log(result)
 })
})
  
});

app.listen(process.env.PORT || port);
