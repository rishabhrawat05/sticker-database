const mongoose = require('mongoose');

const stickerSchema = new mongoose.Schema({
    image: {
        size: {type: Number, required: true},
        name: {type: String, required: true},
        dateCreated: {type: Date, default: Date.now, required: true},
        dateModified: {type: Date, default: Date.now ,required: true},
        url: {type: String, required: true}

    },
    description: {type: String},
    amount: {type: Number, required: true},
    locationSource: {type: String, default: "Unknown"},
    designerName: {type: String, default: "Unknown"},
    stickerPrinter: {type: String, default: "Unknown"},
    rating:{
        design: {type: Number, min: 0, max: 5},
        quality: {type: Number, min: 0, max: 5}
    },
    dateCollected: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Sticker", stickerSchema);