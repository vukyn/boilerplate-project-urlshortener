require('dotenv').config();
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const app = express();
var bodyParser = require("body-parser");

// Basic Configuration
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const ShortUrl = require('./shorturl.js').ShortUrlModel;
const createShortUrl = require('./shorturl.js').createAndSave;
const findOriginalUrl = require('./shorturl.js').findOriginalByShortUrl;
const findOriginalUrl2 = require('./shorturl.js').findOriginalByShortUrl2;

app.post("/api/shorturl", (req, res, next) => {
  // Check invalid url format
  const HTTPS_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  if (!(req.body.url.match(new RegExp(HTTPS_REGEX))))
    return res.json({ error: "Invalid URL" });
    
  //Check invalid hostname
  const REPLACE_REGEX = /^https?:\/\//i
  const _url = req.body.url.replace(REPLACE_REGEX, '');
  dns.lookup(_url, { family: 6, hints: dns.ADDRCONFIG | dns.V4MAPPED }, (err) => {
    if (err)
      res.json({ error: "Invalid Hostname" });
    else {
      createShortUrl(req.body.url, (err, data) => {
        if (err) {
          return next(err);
        }
        ShortUrl.findById(data._id, function (err, url) {
          if (err) {
            return next(err);
          }
          res.json({ original_url: url.original_url, short_url: url.short_url_2 });
        });
      });
    }
  });
});

app.get("/api/shorturl/:short_url", (req, res, next) => {
  findOriginalUrl(req.params.short_url, (err, url) => {
    if (err) {
      return next(err);
    }
    if (!url) {
      res.json({ error: "No short URL found for the given input" });
    }
    else
      res.redirect(url.original_url);
  });
});

app.get("/:short_url", (req, res, next) => {
  findOriginalUrl2(req.params.short_url, (err, url) => {
    if (err) {
      return next(err);
    }
    if (!url) {
      res.json({ error: "No short URL found for the given input" });
    }
    else
      res.redirect(url.original_url);
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log(`Listening on port ${port}`);
});
