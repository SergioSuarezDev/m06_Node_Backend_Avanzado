const express = require('express');
const router = express.Router();
const Anuncio = require ('../../models/anuncio')

router.get('/', async (req, res, next) => {

  try {
    //Recogemos los valores de entrada
    const name = req.query.name;
    const prize = req.query.prize;
    const type = req.query.type;
    const tags = req.query.tags;
    const start = parseInt(req.query.start);
    const limit = parseInt(req.query.limit);
    const fields = req.query.fields;
    const order = req.query.order;


    const filter = {};

     if (name) {filter.name = new RegExp('^' + name, "i")}
     if (tags) {filter.tags = {$in: tags.split(',')}}

      // Comprobamos y validamos el tipo 
     if (type) {
      if (type === "venta") {filter.sale = true}
      if (type === "busqueda") {filter.sale = false}
    }

      // Comprobamos y validamos el parametro de rango de precios
      if (prize) {
        let p = prize.indexOf('-');

        if (p === -1) { // Precio fijo, sin limites
          filter.prize = prize
        } 
        else {
          let MinMax = prize.split("-")
          let min = MinMax[0];
          let max = MinMax[1];
  
          if (!min) { // Saca los mayores a XX
            min = 0; filter.prize = {$lte : max}
          } 
          if (!max) { //Saca los menores a XX
            max = 0; filter.prize = {$gte : min}
          }
  
          if (min != 0 && max != 0) {  // Saca un limite definido entre min,max
            filter.prize = {$gte : min, $lte : max}
         }
        }



      }

    const anuncios = await Anuncio.getAds(filter, start, limit, fields, order)

    const resultado = {
      success : true,
      results : anuncios
    }

    res.json(anuncios)
    return;
  } catch (err) {
      next(err);
    return;
  }

});


router.post('/nuevo', async (req, res, next) => {

  const name = req.body.name;
  const tags = req.body.tags;
  const foto = req.body.foto;
  const venta = req.body.venta;
  const precio = req.body.precio;

  if (name === undefined || tags === undefined || 
      foto === undefined || venta === undefined || 
      precio === undefined){
    //Validamos que nos lleguen todos los datos
    res.status(409);
    res.json({ success: false, result: "faltan algún dato." });
    return;
  }


  try {

    // ojo cuidadin para recibir fichero con MULTER
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any

        const data = req.body;
        const anuncio = new Anuncio(data);
        const anuncioGuardado = await anuncio.save();    
    
        res.json({ success: true, result: anuncioGuardado });
    
    } catch(err) {
      next(err);
      return;
    }
  });


router.get('/tags', async (req, res, next) => {
    try {

      const tags = await Anuncio.getTags();
      res.json({ success: true, result: tags });
      
      } catch(err) {
        next(err);
        return;
      }
});

module.exports = router;
