const express = require('express');
const router = express.Router();


router.get("/", function(parametros, salida){ 
  let info  = dameInfoApp();
  salida.contentType('application/json').status(200);
  salida.send(JSON.stringify(info));
}); 

router.get("/info", function(parametros, salida){ 
  let info  = dameInfoApp();
  salida.contentType('application/json').status(200);
  salida.send(JSON.stringify(info));
}); 


function dameInfoApp(){
 let infoAPP = require('../../package.json');
 let res = {
      name: infoAPP.name,
      version: infoAPP.version,
      autor: infoAPP.author,
      descripcion: infoAPP.description,
      licencia: infoAPP.license,
  }
  return res;
}


module.exports = router;
