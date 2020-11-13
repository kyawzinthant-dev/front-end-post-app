const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();


const postsRoutes = require('./routes/posts');

mongoose.connect(`mongodb+srv://kzinthant:bJRSaV5iZY6PCMZG@cluster0.ss9il.mongodb.net/postdb?retryWrites=true&w=majority
`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Connected to the database')
}).catch(e => {
  console.log(e)
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin', '*'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  next();
})

app.use("/api/posts", postsRoutes);

module.exports = app;