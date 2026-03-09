var ws;

const urlParams = new URLSearchParams(window.location.search);
var domanda = urlParams.get('request');

function ready(){
    var sndc = document.createElement("div");
    sndc.className = "outgoing-chats";

    var sndi = document.createElement("div");
    sndi.className = "outgoing-chats-img";

    var img = document.createElement("img");
    img.src = "/images/user.png";

    sndi.append(img);
    sndc.append(sndi);

    var sndm = document.createElement("div");
    sndm.className = "outgoing-msg";

    var sndt = document.createElement("div");
    sndt.className = "outgoing-chats-msg";

    var p = document.createElement("p");
    p.textContent = domanda;

    var timestampSpan = document.createElement("span");
    timestampSpan.className = "time";
    var now = new Date();
    var dateString = now.toLocaleDateString("en-US", { month: 'long', day: 'numeric' });
    var timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timestampSpan.textContent = `${timeString} | ${dateString}`;

    sndt.append(p);
    sndm.append(sndt);
    sndt.append(timestampSpan);
    sndc.append(sndm);

    document.getElementById("msgPg").append(sndc);

    ws = new WebSocket("ws://localhost:8081");
    ws.addEventListener("message", function(event){
        var msg = JSON.parse(event.data);

        if(msg.text != "assoc creata"){
            var rcvc = document.createElement("div");
            rcvc.className = "received-chats";

            var rcvi = document.createElement("div");
            rcvi.className = "received-chats-img";

            var img = document.createElement("img");
            img.src = "/images/assistente.png";

            rcvi.append(img);
            rcvc.append(rcvi);

            var rcm = document.createElement("div");
            rcm.className = "received-msg";

            var rcvt = document.createElement("div");
            rcvt.className = "received-msg-inbox";

            var p = document.createElement("p");
            p.textContent = msg.text;

            var timestampSpan = document.createElement("span");
            timestampSpan.className = "time";
            var now = new Date();
            var dateString = now.toLocaleDateString("en-US", { month: 'long', day: 'numeric' });
            var timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            timestampSpan.textContent = `${timeString} | ${dateString}`;
    

            rcvt.append(p);
            rcvt.append(timestampSpan);
            rcm.append(rcvt);
            rcvc.append(rcm);

            document.getElementById("msgPg").append(rcvc);
        }else{
            return;
        }
    });

    ws.addEventListener("open", function(event){
        console.log("siamo connessi");
        var msgStart = {
            id: "D",
            text: "domanda",
            index : "primoMessaggio"
        };
        ws.send(JSON.stringify(msgStart));
    });

        
    document.getElementById("b1").addEventListener("click", send);
}

function send(){
    clientId = "D";
    var messaggio = {
        tipo: "messaggio",
        text: document.getElementById("text").value,
        id: clientId
    };
    console.log("Messaggio inviato: " + messaggio.text);
    ws.send(JSON.stringify(messaggio));

    var sndc = document.createElement("div");
    sndc.className = "outgoing-chats";

    var sndi = document.createElement("div");
    sndi.className = "outgoing-chats-img";

    var img = document.createElement("img");
    img.src = "/images/user.png";

    sndi.append(img);
    sndc.append(sndi);

    var sndm = document.createElement("div");
    sndm.className = "outgoing-msg";

    var sndt = document.createElement("div");
    sndt.className = "outgoing-chats-msg";

    var p = document.createElement("p");
    p.textContent = messaggio.text;

    var timestampSpan = document.createElement("span");
    timestampSpan.className = "time";
    var now = new Date();
    var dateString = now.toLocaleDateString("en-US", { month: 'long', day: 'numeric' });
    var timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timestampSpan.textContent = `${timeString} | ${dateString}`;

    sndt.append(p);
    sndm.append(sndt);
    sndt.append(timestampSpan);
    sndc.append(sndm);

    document.getElementById("msgPg").append(sndc);

    document.getElementById("text").value = "";
}


window.addEventListener("beforeunload", function(event){
    event.preventDefault();
    
    var disconnectMsg = {
        id: "D",
        text: "disconnesso"
    };
    ws.send(JSON.stringify(disconnectMsg));
    
    e.returnValue = '';
});

document.addEventListener("DOMContentLoaded", ready);