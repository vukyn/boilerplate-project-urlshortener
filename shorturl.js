require('dotenv').config();
var mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const shorturlSchema = new Schema({
    original_url: { type: String, required: true },
    short_url: { type: Number, default: 0 }
});

var ShortUrl = mongoose.model("shorturl", shorturlSchema);

// var entitySchema = mongoose.Schema({
//     testvalue: { type: String }
// });

// entitySchema.pre('save', function (next) {
//     var doc = this;
//     shorturl.findByIdAndUpdate({ _id: 'entityId' }, { $inc: { short_url: 1 } }, function (error, counter) {
//         if (error)
//             return next(error);
//         doc.testvalue = counter.seq;
//         next();
//     });
// });


const createAndSave = (original_url, done) => {
    const _shorturl = new ShortUrl({
        original_url: original_url
    });
    _shorturl.save(function (err, data) {
        if (err) return console.error(err);
        done(null, data);
    });
};

exports.ShortUrlModel = ShortUrl;
exports.createAndSave = createAndSave;