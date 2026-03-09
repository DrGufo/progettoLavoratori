<?php
// Parametri di connessione al database
$hostname = "localhost"; // Indirizzo del server del database
$username = "root";    // Nome utente del database
$database = "esercizioLavoratori";   // Nome del database

// Creazione di una connessione a MySQL usando MySQLi
$connessione = new mysqli($hostname, $username, "" , $database);

// Verifica della connessione
if ($connessione->connect_error) {
    die("Connessione fallita: " . $connessione->connect_error);
}

$dati = json_decode(file_get_contents("php://input"), true);

$lavoro = $dati["lavoro"];

$dbDaRichiedere = "db" . ucfirst($lavoro);

$query = "SELECT * FROM $dbDaRichiedere WHERE disponibilita = 1";

$query = $connessione->prepare($query);

$query->execute();

$result = $query->get_result();

$mansioni = array();

while ($row = $result->fetch_assoc()) {
    $mansioni[] = $row;
}

echo json_encode($mansioni);

$connessione->close();

?>