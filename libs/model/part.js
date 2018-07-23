var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Part = new Schema({
    name: { type: String, required: true },
    origArticle: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String },
    applicability: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    modified: { type: Date, default: Date.now }
});

Part.path('name').validate(function (v) {
    return v.length > 5 && v.length < 70;
});

module.exports = mongoose.model('Part', Part);
