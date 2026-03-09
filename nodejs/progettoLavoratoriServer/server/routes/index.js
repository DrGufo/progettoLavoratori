var express = require('express');
var router = express.Router();
const MongoClient=require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27020/?directConnection=true'; // Replace with your sharded MongoDB connection strings  
const bodyParser = require('body-parser');
var parsebody=express.urlencoded({extended:true})

var WebSocket = require('ws');

const socketServer = new WebSocket.Server({ port: 8080 });

const ws = new WebSocket("ws://localhost:8080");

const client=new MongoClient(uri);

const cors = require('cors');
router.use(cors());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

socketServer.on("connection", ws => {
  console.log("new client connected");
  
  client.connect()
  .then(()=>{    
    const db=client.db("progettoLavoratoriRemoto");
    const collection=db.collection("prenotazioni");

    return collection.find({}).toArray();
  })
  .then(documents=>{
    
    console.log(documents);

    ws.send(JSON.stringify(documents));
    
  })
  .catch(err=>{
    console.log(err);
  });

  ws.on("message", data => {
      dato = JSON.parse(data);
      console.log('Client has sent us:' + dato.id);
      ws.send(JSON.stringify(dato));
  });
  // Gestione della disconnessione del client dal server
  ws.on("close", () => {
      console.log("the client has connected");
  });
  // gestione degli errori di connessione del client
  ws.onerror = function() {
      console.log("Some Error occurred")
  }
});


router.get('/insertData', cors(), parsebody, function(req, res, next) {
  // Extract the data sent by the client
  var nomeUtente = req.query.nomeUtente;
  var nomeLavoratore = req.query.nomeLavoratore;
  var cognomeLavoratore = req.query.cognomeLavoratore;
  var mansioneRichiesta = req.query.mansione;
  var via = req.query.via;
  var civico = req.query.civico;
  var citta = req.query.citta;
  var dataOraInizio = req.query.dataOraInizio;
  var dataOraFine = req.query.dataOraFine;

  // Use the received data as needed
  console.log(nomeUtente);
  console.log(nomeLavoratore);
  console.log(cognomeLavoratore);
  console.log(mansioneRichiesta);
  console.log(via);
  console.log(civico);
  console.log(citta);
  console.log(dataOraInizio);
  console.log(dataOraFine);

  var dataInizio = dataOraInizio.split("T")[0];

  var giornoInizio = dataInizio.split("-")[2];

  var meseInizio = dataInizio.split("-")[1];

  var annoInizio = dataInizio.split("-")[0];

  console.log(giornoInizio);
  console.log(meseInizio);
  console.log(annoInizio);

  var orarioInizio = dataOraInizio.split("T")[1];

  var oraInizio = orarioInizio.split(":")[0];

  var minutiInizio = orarioInizio.split(":")[1];
  
  console.log(oraInizio);
  console.log(minutiInizio);

  var dataFine = dataOraFine.split("T")[0];

  var giornoFine = dataFine.split("-")[2];

  var meseFine = dataFine.split("-")[1];

  var annoFine = dataFine.split("-")[0];

  console.log(giornoFine);
  console.log(meseFine);
  console.log(annoFine);

  var orarioFine = dataOraFine.split("T")[1];

  var oraFine = orarioFine.split(":")[0];

  var minutiFine = orarioFine.split(":")[1];
  
  console.log(oraFine);
  console.log(minutiFine);

  
  client.connect()
  .then(()=>{
    console.log("Connected correctly to server");
    
    const db=client.db("progettoLavoratoriRemoto");
    const collection=db.collection("prenotazioni");
    
    var prenotazione = {
      nomeUtente: nomeUtente,
      nomeLavoratore: nomeLavoratore,
      cognomeLavoratore: cognomeLavoratore,
      mansione: mansioneRichiesta,
      via: via,
      civico: civico,
      citta: citta,
      giornoInizio: giornoInizio,
      meseInizio: meseInizio,
      annoInizio: annoInizio,
      oraInizio: oraInizio,
      minutiInizio: minutiInizio,
      giornoFine: giornoFine,
      meseFine: meseFine,
      annoFine: annoFine,
      oraFine: oraFine,
      minutiFine: minutiFine
    }
    
    // Send prenotazione data to the client
    socketServer.clients.forEach(function(client) {
      client.send(JSON.stringify(prenotazione));
    });

    return collection.insertOne(prenotazione);
  })
  .then(documents=>{
    console.log("Contuenuto della collection prodotti: ");

    console.log(documents);
    
  })
  .catch(err=>{
    console.log(err);
  })
  .finally(()=>{
    client.close();
  });

  res.send("Prenotazione inserita correttamente!");
});

module.exports = router;