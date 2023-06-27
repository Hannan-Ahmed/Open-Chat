const connecttomongo = require('./connection');
const express = require('express')
const MessagingSchema = require('./MessagingSchema.js')
var cors = require('cors')
const Pusher = require('pusher')
const mongoose = require('mongoose');
const UserSchema = require('./UserSchema');
//App Config
const app = express()
const port = process.env.PORT || 9000


app.use(cors())
app.use(express.json())


// ***************************************  PUSHER CONFIGURATION STARTS       **************************************


//Middleware
const pusher = new Pusher({
  appId: "1616532",
  key: "664021629f4234c1d01e",
  secret: "0edf87e5f4c05588e13d",
  cluster: "eu",
  useTLS: true
});



//API Endpoints
const db = mongoose.connection
db.once("open", () => {
  console.log("DB Connected")
  const msgCollection = db.collection("messagingmessages")
  const changeStream = msgCollection.watch()
  changeStream.on('change', change => {
    console.log(change)
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received
      })
    } else {
      console.log('Error trigerring Pusher')
    }
  })
})
// ***************************************  PUSHER CONFIGURATION ENDS       **************************************





// ***************************************  API Endpoints Starts       **************************************

app.post('/messages/new', async (req, res) => {
  const dbMessage = req.body
  MessagingSchema.create(dbMessage)
  res.status(200).json(dbMessage);
})

app.post('/users/new', async (req, res) => {
  const dbuser = req.body
  UserSchema.create(dbuser)
  res.status(200).json(dbuser);
})


app.get('/messages/sync', async (req, res) => {
  const a = await MessagingSchema.find()
  res.status(200).json(a);
})

app.get('/users/sync', async (req, res) => {
  const a = await UserSchema.find()
  res.status(200).json(a);
})

// ***************************************  API Endpoints here       **************************************


// ***************************************  Server Listening       **************************************


app.listen(port, () => console.log(`Listening on localhost: ${port}`))
connecttomongo()