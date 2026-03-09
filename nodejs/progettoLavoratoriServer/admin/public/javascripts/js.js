var ws;
function ready() {
    ws = new WebSocket("ws://localhost:8080");
    ws.addEventListener('message', function(event) {
        var msg1 = JSON.parse(event.data);
        
        for(var i=0; i<msg1.length; i++){
            var via = msg1[i].via;
            var civico = msg1[i].civico;
            var citta = msg1[i].citta;

            var url = "https://maps.google.com/maps?q=" + via + "%20" + civico + "%20" + citta + "&amp;t=k&amp;z=13&amp;ie=UTF8&amp;iwloc=&amp;output=embed";

            url = url.replace(/ /g, "%20");

            var dataInizio = msg1[i].giornoInizio + "/" + msg1[i].meseInizio + "/" + msg1[i].annoInizio;

            var orarioInizio = msg1[i].oraInizio + ":" + msg1[i].minutiInizio;

            var dataFine = msg1[i].giornoFine + "/" + msg1[i].meseFine + "/" + msg1[i].annoFine;

            var orarioFine = msg1[i].oraFine + ":" + msg1[i].minutiFine;

            document.getElementById("text").innerHTML = "<div class='divIntervento'><div class='divUser'>Nome utente: " + msg1[i].nomeUtente + "</div><br><div class='divNomeLav'>" + "Nome lavoratore: " + msg1[i].nomeLavoratore + "</div><br><div class='divCognLav'>" + "Cognome lavoratore: " + msg1[i].cognomeLavoratore + "</div><br><div class='divMansReq'>" + "Mansione richiesta: " + msg1[i].mansione + "</div><br>"+ "Data inizio: <div class='divDataInizio'>" + dataInizio + "</div><br>" + "Orario inizio: <div class='divOrarioInizio'>" + orarioInizio + "</div><br>" + "Data fine: <div class='divDataFine'>" + dataFine + "</div><br>" + "Orario fine: <div class='divOrarioFine'>" + orarioFine + "</div><br>" +"<iframe src="+url+" width=500 height=350 allowfullscreen></iframe><br></div><hr>" + document.getElementById("text").innerHTML;
        }
    });
    ws.addEventListener("open", () => {
       console.log("We are connected");
    });
}

document.addEventListener("DOMContentLoaded", ready);