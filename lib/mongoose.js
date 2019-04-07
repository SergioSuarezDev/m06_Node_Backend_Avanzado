'use strict'

const mongoose = require('mongoose');
const uriConexion = 'mongodb://localhost:32777/nodepop';

//Conexión a mongoose
mongoose.connect(uriConexion , { useNewUrlParser: true }, function(err) {
    if (err) throw err;
});

module.exports = mongoose.connection;

