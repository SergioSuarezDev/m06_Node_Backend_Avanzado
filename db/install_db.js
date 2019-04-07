'use strict';

/** 
 * Datos iniciales de la BBDD
*/

const readline = require('readline');
const db = require ('./../lib/mongoose.js');
const Anuncio = require('../models/anuncio');
const anunciosData = require('../data/anuncios.json');

db.once( 'open', async () =>{
    try {
        // Preguntar al usuario si quiere borrar la BD
        const response = await askUser('¿Seguro que quieres borrar la BD? (no) (si) ');
        if (response.toLowerCase() !== 'si') {
            console.log('Proceso Abortado');
            process.exit(0);
        }
        
        await initModel(Anuncio, anunciosData.ads, 'anuncios');
        db.close;
        process.exit(0);


    } catch (error) {
        console.log("Hubo un error:", error);
        process.exit(1);
    }
})

function askUser(question) {
    return new Promise((resolve, reject) => {
        const intf = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        intf.question(question, answer => {
            intf.close();
            resolve(answer);
            return;
        })
    });
}

async function initModel(Model, data, modelName) {
    const borrados  = await Model.deleteMany();
    console.log(`Eliminados: ${borrados.n}  ${modelName}`);
    const insertados = await Model.insertMany(data);
    console.log(`Insertados: ${insertados.length}  ${modelName}`);
    return;
}