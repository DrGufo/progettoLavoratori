var ws;
function ready(){
    ws = new WebSocket("ws://localhost:8081");
    ws.addEventListener("message", function(event){
        var msg = JSON.parse(event.data);

        if(msg.text != "assoc creata"){
            var rcvc = document.createElement("div");
            rcvc.className = "received-chats";

            var rcvi = document.createElement("div");
            rcvi.className = "received-chats-img";

            var img = document.createElement("img");
            img.src = "/images/user.png";

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
            id: "R",
            text: "operatore",
            index : "primoMessaggio"
        };
        ws.send(JSON.stringify(msgStart));
    });

    document.getElementById("b1").addEventListener("click", send);
    
}

function send(){
    clientId = "R";
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
    img.src = "/images/assistente.png";

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
    sndt.append(timestampSpan);
    sndm.append(sndt);
    sndc.append(sndm);

    document.getElementById("msgPg").append(sndc);
    
    document.getElementById("text").value = "";
}


document.addEventListener("DOMContentLoaded", ready);

window.addEventListener("beforeunload", function(event){
    event.preventDefault();

    var disconnectMsg = {
        id: "R",
        text: "disconnesso"
    };
    ws.send(JSON.stringify(disconnectMsg));
    
    e.returnValue = '';
});