require('dotenv').config();
var mongoose = require('mongoose');
var randomstring = require('randomstring');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const shorturlSchema = new Schema({
    original_url: { type: String, required: true },
    short_url: { type: String, required: false }
});

var ShortUrl = mongoose.model("shorturl", shorturlSchema);

const findOriginalByShortUrl = (short_url, done) => {
    ShortUrl.findOne({ short_url: short_url }, (err, data) => {
        if (err) return console.log(err);
        done(null, data);
    });
};

const createAndSave = (original_url, done) => {

    const _shorturl = new ShortUrl({
        original_url: original_url,
        short_url: randomstring.generate(7)
    });

    _shorturl.save(function (err, data) {
        if (err) return console.error(err);
        done(null, data);
    });
};

exports.ShortUrlModel = ShortUrl;
exports.createAndSave = createAndSave;
exports.findOriginalByShortUrl = findOriginalByShortUrl;