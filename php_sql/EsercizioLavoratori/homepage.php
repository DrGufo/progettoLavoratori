<?php
    if(!isset($_GET["status"]) || $_GET["status"] !== "logged") {
        die("Operazione non consentita");
    }

    $usernameRaw = $_GET["username"] ?? "";
    $username = htmlspecialchars($usernameRaw, ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestione microservizi</title>
</head>
<body>
    <div id="header-buttons">
        <button id="button1" onclick="window.location.href='http://localhost:3020?username=<?php echo urlencode($usernameRaw); ?>'">Vai al blog</button>
        <button id="button2" onclick="window.location.href='http://localhost:3200/assistenza?username=<?php echo urlencode($usernameRaw); ?>'">Hai bisogno di assistenza?</button>
    </div>
    <h1>Gestione microservizi</h1>
    <div id="divPrenotazione">
        <label for="professione">Professione:</label>
        <select id="selectLavoro">
            <option>--Seleziona--</option>
            <option value="idraulici">Idraulico</option>
            <option value="elettricisti">Elettricista</option>
            <option value="muratori">Muratore</option>
        </select>
        <label for="mansione">Mansione:</label>
        <select id="selectMansione">
            <option>--Seleziona--</option>
        </select>
        <label for="indirizzo">Indirizzo:</label>
        <div id="indirizzo">
            <input id="inputVia" type="text" placeholder="Via"></input>
            <input id="inputCivico" type="text" placeholder="Civico"></input>
            <input id="inputCitta" type="text" placeholder="Città"></input>
        </div>
        <label for="inputDataOra">Giorno e ora</label>
        <input id="inputDataOraInizio" type="datetime-local"></input>
        <input id="inputDataOraFine" type="datetime-local"></input>
        <button id="buttonPrenota">Prenota</button>
    </div>
    <br>
    <script>
        document.getElementById("selectLavoro").addEventListener("change", function() {
            var lavoro = this.value;
            var selectMansione = document.getElementById("selectMansione");
            if(lavoro == "--Seleziona--") {
                selectMansione.innerHTML = "<option>--Seleziona--</option>";
                return;
            }
            fetch("http://localhost/php/EsercizioLavoratori/backend/getMansioni.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({lavoro: lavoro})
            })
            .then(response => response.json())
            .then(data => {
                selectMansione.innerHTML = "";
                if(!Array.isArray(data) || data.length === 0){
                    var option = document.createElement("option");
                    option.value = "Nessuna mansione disponibile";
                    option.textContent = "Nessuna mansione disponibile";
                    selectMansione.appendChild(option);
                    document.getElementById("buttonPrenota").disabled = true;
                }else{
                    data.forEach(mansione => {
                        var option = document.createElement("option");
                        option.value = mansione.mansione;
                        option.textContent = mansione.mansione;
                        selectMansione.appendChild(option);
                        document.getElementById("buttonPrenota").disabled = false;
                    });
                }
            })
            .catch(() => {
                selectMansione.innerHTML = "<option>--Seleziona--</option>";
                document.getElementById("buttonPrenota").disabled = true;
            });
        });

        document.getElementById("buttonPrenota").addEventListener("click", function() {
            var lavoro = document.getElementById("selectLavoro").value;
            var mansione = document.getElementById("selectMansione").value;
            var via = document.getElementById("inputVia").value;
            var civico = document.getElementById("inputCivico").value;
            var citta = document.getElementById("inputCitta").value;
            var dataOraInizio = document.getElementById("inputDataOraInizio").value;
            var dataOraFine = document.getElementById("inputDataOraFine").value;

            
            if(lavoro == "--Seleziona--" || mansione == "--Seleziona--") {
                alert("Seleziona un lavoro e una mansione");
                return;
            }

            fetch("http://localhost/php/EsercizioLavoratori/backend/schedulazione.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({lavoro: lavoro, mansione: mansione})
            })
            .then(response => response.text())
            .then(data => {
                data = JSON.parse(data);
                if (!data || !data.id) {
                    alert("Nessun lavoratore disponibile per la mansione selezionata");
                    return;
                }

                alert("Prenotazione effettuata");
                console.log(data); 

                var nomeUtente = "<?php echo $username; ?>";

                var nomeLavoratore = data.nome;
                var cognomeLavoratore = data.cognome;
                var mansione = data.mansione;

                var params = new URLSearchParams({
                    nomeUtente: nomeUtente,
                    nomeLavoratore: nomeLavoratore,
                    cognomeLavoratore: cognomeLavoratore,
                    mansione: mansione,
                    via: via,
                    civico: civico,
                    citta: citta,
                    dataOraInizio: dataOraInizio,
                    dataOraFine: dataOraFine
                });

                fetch("http://localhost:3000/insertData?" + params.toString())
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                });

                fetch("http://localhost/php/EsercizioLavoratori/backend/insertIntervento.php", {
                    method: "POST",
                    body: JSON.stringify({id_Lavoratore: data.id, mansione_richiesta: data.mansione, specializzazione: data.nome})
                })
                .then(response => response.text())
                .then(data => {
                    console.log(data);
                    location.reload();
                });
            })
            .catch(() => {
                alert("Errore durante la prenotazione");
            });
        });
    </script>
    <style>
        a{
            display: block;
            margin: 20px;
            text-align: center;
            font-size: 16px;
            color:#00B7FF;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 20px;
            margin: 0;
            padding: 0;
            background-color: #DEDDDC;
        }

        #divPrenotazione {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: 50px auto;
            padding: 20px;
            text-align: center;
            width: 300px;
        }

        h1 {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
        }

        div {
            margin-top: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            color: #555;
        }

        input, select {
            padding: 10px;
            margin: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
        }

        button {
            padding: 12px;
            margin: 10px;
            background-color: #009245;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        button:hover {
            background-color: #007336;
        }
        #divInformazioni{
            margin-top: 20px;
            text-align: center;
        }
            
        #header-buttons {
            position: absolute;
            top: 10px;
            right: 10px;
        }

        #header-buttons form {
            display: inline-block;
        }

        #button1, #button2 {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            margin-top: 5px;
            padding: 8px 16px;
            cursor: pointer;
        }

        #button1:hover {
            background-color: #0056b3;
        }

        #button2:hover {
            background-color: #0056b3;
        }
    
    </style>
</body>
</html>