'use strict';

const mongoose = require('mongoose');

// Definimos esquema 
let anuncioSchema = new mongoose.Schema({
    name: String,
    tags: [String],
    sale: Boolean,
    prize: Number,
    picture: String,
}, {collection: 'anuncios'});


anuncioSchema.statics.getAds = (filter, start, limit, fields, order) => {
    const query = Anuncio.find(filter);
    query.skip(start);
    query.limit(limit);
    query.select(fields);
    query.sort(order);
    let res = query.exec();
    return res;
}

anuncioSchema.statics.getTags = () => {
    const query = Anuncio.distinct("tags");
    let res = query.exec();
    return res;
}

const Anuncio = mongoose.model('Anuncio', anuncioSchema);


module.exports = Anuncio;