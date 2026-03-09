var express = require('express');
var WebSocket = require('ws');

var router = express.Router();

const socketServer = new WebSocket.Server({ port: 8081 });

const ws = new WebSocket("ws://localhost:8081");

var arraySpecializzazioni = [
  "Idraulici",
  "Elettricisti",
  "Muratori"
];

console.log(arraySpecializzazioni);

var arrayOperatoriDisponibili = [];
var arrayDomandeDisponibili = [];

var arrayAssociazioni = [];

var iD = 0;
var iR = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

socketServer.on("connection", ws => {
  console.log("new client connected");
    ws.on("message", data => {
        dato = JSON.parse(data);
        console.log(dato.id + ' has sent us:' + dato.text);

        if(dato.text != "disconnesso"){

          if(dato.index === "primoMessaggio"){
            if (dato.id === 'D') {
              arrayDomandeDisponibili.push({ id: dato.id + iD, ws: ws });
              iD++;
              console.log(arrayDomandeDisponibili);
            } else if (dato.id === 'R') {
              if(arraySpecializzazioni.length > 0){
                arrayOperatoriDisponibili.push({ id: dato.id + iR, ws: ws, specializzazione: arraySpecializzazioni.pop()});
                
                iR++;
                console.log(arrayOperatoriDisponibili);
              }else{
                console.log("nessun operatore disponibile");
              }
            }
          }

          console.log("-----------------------------------------------------------");
          console.log("arrayOperatoriDisponibili: "); 
          console.log(arrayOperatoriDisponibili);
          console.log("arrayDomandeDisponibili: ");
          console.log(arrayDomandeDisponibili);
          console.log("-----------------------------------------------------------")

          if (arrayOperatoriDisponibili.length > 0 && arrayDomandeDisponibili.length > 0 && (dato.text === "domanda" || dato.text === "operatore")) {
            var operatore = arrayOperatoriDisponibili.pop();
            var domanda = arrayDomandeDisponibili.pop();
            var associazione = {
              operatore: operatore.id,
              domanda: domanda.id,
              specializzazione: operatore.specializzazione,
              wsOperatore: operatore.ws,
              wsDomanda: domanda.ws
            };
            arrayAssociazioni.push(associazione);

            console.log("associazione creata: ");
            console.log(arrayAssociazioni);
            console.log(arrayOperatoriDisponibili);

          }

          if (dato.text !== "domanda" && dato.text !== "operatore" && dato.text !== "disconnesso") {
            var mittente;
            if (dato.id === 'D') {
              mittente = dato.id + arrayDomandeDisponibili.length;
            } else if (dato.id === 'R') {
              mittente = dato.id + arrayOperatoriDisponibili.length;
            }
            
            var messaggio = dato.text;
          
            var associazione;
            if (mittente.startsWith('D')) {
              associazione = arrayAssociazioni.find(associazione => associazione.domanda === mittente);
            } else if (mittente.startsWith('R')) {
              associazione = arrayAssociazioni.find(associazione => associazione.operatore === mittente);
            }
          
            console.log('Associazione:', associazione);
          
            if (associazione) {
              if (mittente.startsWith('D')) {
                wsDestinatario = associazione.wsOperatore;
              } else if (mittente.startsWith('R')) {
                wsDestinatario = associazione.wsDomanda;
              }

              switch (dato.classification) {
                case "muratore":
                  for (var i = 0; i < arrayAssociazioni.length; i++) {
                    if (arrayAssociazioni[i].specializzazione === "Muratori") {
                      wsDestinatario = arrayAssociazioni[i].wsOperatore;
                      break;
                    }
                  }
                  break;
                case "idraulico":
                  for (var i = 0; i < arrayAssociazioni.length; i++) {
                    if (arrayAssociazioni[i].specializzazione === "Idraulici") {
                      wsDestinatario = arrayAssociazioni[i].wsOperatore;
                      break;
                    }
                  }
                  break;
                case "elettricista":
                  for (var i = 0; i < arrayAssociazioni.length; i++) {
                    if (arrayAssociazioni[i].specializzazione === "Elettricisti") {
                      wsDestinatario = arrayAssociazioni[i].wsOperatore;
                      break;
                    }
                  }
                  break;
                default:
                  break;
              }
              console.log('wsDestinatario:', wsDestinatario);
              wsDestinatario.send(JSON.stringify({ text: messaggio, id: mittente }));
            }
          } else {
            console.log("non è un messaggio");
          }
        }else{
          var associazioneVecchia = arrayAssociazioni.pop();

          if(dato.id == 'D'){
            arrayDomandeDisponibili.pop();
            iD--;
            console.log("rimosso");
            console.log(arrayDomandeDisponibili);
            if(associazioneVecchia != undefined){
              var wsOp = associazioneVecchia.wsOperatore;
              var idOp = associazioneVecchia.operatore;
              var specializzazioneOp = associazioneVecchia.specializzazione;

              arrayOperatoriDisponibili.push({id: idOp, ws: wsOp, specializzazione: specializzazioneOp});
              arraySpecializzazioni.push(specializzazioneOp);
            }
          }else if(dato.id == 'R'){
            arrayOperatoriDisponibili.pop();
            iR--;
            console.log("rimosso");
            console.log(arrayOperatoriDisponibili);

            if(associazioneVecchia != undefined){
              var wsDom = associazioneVecchia.wsDomanda;
              var idDom = associazioneVecchia.domanda;

              arrayDomandeDisponibili.push({id: idDom, ws: wsDom});
            }
          }

          console.log("-----------------------------------------------------------");
          console.log("arrayOperatoriDisponibili: ");
          console.log(arrayOperatoriDisponibili);
          console.log("arrayDomandeDisponibili: ");
          console.log(arrayDomandeDisponibili);
          console.log("-----------------------------------------------------------")
          
        }
    });
    // Gestione della disconnessione del client dal server
    ws.on("close", () => {
      console.log("Client has disconnected");
    });
    // gestione degli errori di connessione del client
    ws.onerror = function() {
      console.log("Some Error occurred")
    }
});

module.exports = router;