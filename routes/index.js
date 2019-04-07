const express = require('express');
const router = express.Router();
const http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {

  let params = {} 
  if (req.query.name) params.name = req.query.name;
  if (req.query.order) params.order = req.query.order;
  if (req.query.type) params.type = req.query.type;
  if (req.query.prize) params.prize = req.query.prize;
  if (req.query.tags) params.tags = req.query.tags;


  // Cogemos todos los parametros recibidos y montamos la QueryString
  let URLSearch = '', v = 0;

  for(let [i, v] of Object.entries(params)) {
    if (v == 0)  {
      URLSearch += i + "=" + v;
    } else {
      URLSearch += "&" + i + "=" + v;
    }
    v++;
  }

  // Llamamos al api usando el QueryString montado
  http.get('http://localhost:3000/api_v1/anuncio/?' + URLSearch, (resp) => {
    let data = '';

    resp.on('data', (d) => {
      data += d;
    });

    resp.on('end', () => {

      //Preparo un array para mejorar los datos de salida
      let adsFinal = [];
      data = JSON.parse(data);

      for (let ad of data) {
        if (ad.sale == false){
          ad.type = "Busqueda"
        } else {
          ad.type = "Venta"
        }
        let montaPrecio = ad.prize + "  €";
        ad.prize = montaPrecio.replace(".",",")
        adsFinal.push(ad);
      } 

      // Llamamos al api para sacar los tags
      http.get('http://localhost:3000/api_v1/anuncio/tags', (resp) => {
        let tags = '';
    
        resp.on('data', (d) => {
          tags += d;
        });


        resp.on('end', () => {

          tags = JSON.parse(tags);

          let data = {
            title: 'Nodepop',
            ads: adsFinal,
            tags: tags.result
          }

          // Finalmente renderizamos la vista con todos los datos
          res.render('index', data);

        });
      });

     

    });
  });


  

});

module.exports = router;
