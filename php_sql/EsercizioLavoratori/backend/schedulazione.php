<?php
$dati = json_decode(file_get_contents("php://input"), true);

$lavoro = $dati["lavoro"];
$mansione = $dati["mansione"];

switch($lavoro) {
    case "idraulici":
        header("Location: http://localhost/php/EsercizioLavoratori/backend/prenotazioneIdraulico.php?mansione=$mansione");
        break;
    case "elettricisti":
        header("Location: http://localhost/php/EsercizioLavoratori/backend/prenotazioneElettricista.php?mansione=$mansione");
        break;
    case "muratori":
        header("Location: http://localhost/php/EsercizioLavoratori/backend/prenotazioneMuratore.php?mansione=$mansione");
        break;
    default:
        echo "Errore";
        break;
}
?>