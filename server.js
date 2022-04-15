require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const ShortUrl = require("./shorturl.js").ShortUrlModel;
const createShortUrl = require("./shorturl.js").createAndSave;


app.post("/api/shorturl", (req, res) => {
  createShortUrl(req.body.url, (err, data) => {
    if (err) {
      return next(err);
    }
    ShortUrl.findById(data._id, function (err, pers) {
      if (err) {
        return next(err);
      }
      res.json(pers);
      //pers.remove();
    });
  });
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
