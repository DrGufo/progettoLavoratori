var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var parsebody=express.urlencoded({extended:true})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); 

/*
router.post('/',parsebody, function( req, res, next ) {
  let request=Object.values(req.body);

  var email=request[0];
  var password=request[1];

  console.log("Username: "+email);
  console.log("Password: "+password); 

  client.connect()
    .then(()=>{
      console.log("Connected correctly to server");
      const db=client.db("chat");
      const collection=db.collection("utenti");
      
      return collection.find({email : email, password : password}).toArray();
    })
    .then(documents=>{
      console.log("Contuenuto della collection prodotti: ");

      if(documents.length==0){
        console.log("Utente non trovato");
        res.redirect('/');
      }else{
        if(email == "admin" && password == "admin"){
          console.log("Admin loggato");
          res.redirect('/operatore');
        }else{
          console.log("Utente loggato");
          res.redirect('/assistenza');
        }
      }
    })
    .catch(err=>{
      console.log(err);
    })
    .finally(()=>{
      client.close();
    });
});*/

router.get('/assistenza', function(req, res, next) {

  res.render('assistenza', { title: 'Assistenza', username : req.query.username});
});

router.get('/operatore', function(req, res, next) {

  res.render('operatore', { title: 'Operatore' });
});

module.exports = router;
