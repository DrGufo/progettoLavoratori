var ws;

var today = new Date(Date.now()).toLocaleString();  //11/4/2024, 13:29:39

var data = today.split(",")[0];
var orario = today.split(", ")[1];

var giornoAttuale = data.split("/")[0].padStart(2, '0');
var meseAttuale = data.split("/")[1].padStart(2, '0');
var annoAttuale = data.split("/")[2];


var oraAttuale = orario.split(":")[0].padStart(2, '0');
var minAttuale = orario.split(":")[1].padStart(2, '0');

var dateTimeAttuale = giornoAttuale + "/" + meseAttuale + "/" + annoAttuale + ", " + oraAttuale + ":" + minAttuale;

var dateTimeAttualeDaConvertire = meseAttuale + "/" + giornoAttuale + "/" + annoAttuale + ", " + oraAttuale + ":" + minAttuale;

console.log(dateTimeAttuale);   //11/04/2024, 13:31:00

var tbody = document.getElementById("bodyInterventi");

function ready() {
    ws = new WebSocket("ws://localhost:8080");
    ws.addEventListener('message', function(event) {
        var msg1 = JSON.parse(event.data);

        console.log(msg1);

        if(msg1.length){
            tbody.innerHTML = "";
            console.log("Dentro if");
            for (var i = 0; i < msg1.length; i++) {
                var dataInizio = msg1[i].giornoInizio + "/" + msg1[i].meseInizio + "/" + msg1[i].annoInizio;
                var orarioInizio = msg1[i].oraInizio + ":" + msg1[i].minutiInizio;

                var dateTimeInizio = dataInizio + ", " + orarioInizio;  //11/04/2024, 11:47:00

                var dataFine = msg1[i].giornoFine + "/" + msg1[i].meseFine + "/" + msg1[i].annoFine;
                var orarioFine = msg1[i].oraFine + ":" + msg1[i].minutiFine;

                var dateTimeFine = dataFine + ", " + orarioFine;    //09/04/2024, 10:21:00

                var dataInizioDaConvertire = msg1[i].meseInizio + "/" + msg1[i].giornoInizio + "/" + msg1[i].annoInizio;

                var dateTimeInizioDaConvertire = dataInizioDaConvertire + ", " + orarioInizio;

                var dataFineDaConvertire = msg1[i].meseFine + "/" + msg1[i].giornoFine + "/" + msg1[i].annoFine;

                var dateTimeFineDaConvertire = dataFineDaConvertire + ", " + orarioFine;

                console.log("---------------------------------------");

                console.log("dateTimeInizio: "+dateTimeInizio);

                console.log("dateTimeFine: "+dateTimeFine);

                console.log("")

                var dateTimeAttualeD = new Date(dateTimeAttualeDaConvertire);

                var dateTimeInizioD = new Date(dateTimeInizioDaConvertire);

                var dateTimeFineD = new Date(dateTimeFineDaConvertire);

                console.log("dateTimeAttuale in data: " +dateTimeAttualeD);

                console.log("dateTimeInizio in data: " +dateTimeInizioD);

                console.log("dateTimeFine in data: " +dateTimeFineD);

                if (dateTimeAttualeD >= dateTimeInizioD && dateTimeAttualeD <= dateTimeFineD) {
                    tbody.innerHTML += "<tr><td>" + msg1[i].nomeUtente + "</td><td>" + msg1[i].nomeLavoratore + "</td><td>" + msg1[i].cognomeLavoratore + "</td><td>" + msg1[i].mansione + "</td><td>" + dataInizio + "</td><td>" + orarioInizio + "</td><td>" + dataFine + "</td><td>" + orarioFine + "</td></tr>";
                }else{
                    console.log("Intervento non attivo");
                }

                console.log("---------------------------------------");
            }
        }else{
            tbody.innerHTML = "<tr><td colspan='8'>Nessun intervento attivo</td></tr>";
        }
    });
    ws.addEventListener("open", () => {
       console.log("We are connected");
    });
}

document.addEventListener("DOMContentLoaded", ready);

var interval = 60000 - (new Date().getSeconds() * 1000 + new Date().getMilliseconds());         //Calcolo del tempo rimanente per il prossimo minuto in modo dinamico

console.log(interval);

setInterval(() => {
    location.reload();
}, interval);