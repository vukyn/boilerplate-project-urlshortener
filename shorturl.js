require('dotenv').config();
var mongoose = require('mongoose');
var randomstring = require('randomstring');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const shorturlSchema = new Schema({
    original_url: { type: String, required: true },
    short_url: { type: Number, default: 0 },
    short_url_2: { type: String, required: false }
});

const counterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

var ShortUrl = mongoose.model("shorturl", shorturlSchema);
var Counter = mongoose.model("counter", counterSchema);

const findOriginalByShortUrl = (short_url, done) => {
    ShortUrl.findOne({ short_url: short_url }, (err, data) => {
        if (err) return console.log(err);
        done(null, data);
    });
};

const findOriginalByShortUrl2 = (short_url_2, done) => {
    ShortUrl.findOne({ short_url_2: short_url_2 }, (err, data) => {
        if (err) return console.log(err);
        done(null, data);
    });
};

const createAndSave = (original_url, done) => {
    // Find current counter number for shorturl and update by 1,
    // Option (new: get updated counter, upsert: create if not exist)
    Counter.findByIdAndUpdate({ _id: 'shorturlId' }, { $inc: { seq: 1 } }, { new: true, upsert: true }, (err, counter) => {
        if (err)
            return console.error(err);
        let _shorturl = new ShortUrl({
            original_url: original_url,
            short_url: counter.seq,
            short_url_2: randomstring.generate(7)
        });
        _shorturl.save((err, data) => {
            if (err) return console.error(err);
            done(null, data);
        });
    });
};

exports.ShortUrlModel = ShortUrl;
exports.createAndSave = createAndSave;
exports.findOriginalByShortUrl = findOriginalByShortUrl;
exports.findOriginalByShortUrl2 = findOriginalByShortUrl2;