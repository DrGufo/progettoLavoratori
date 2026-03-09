<?php

$hostname = "localhost";
$username = "root";
$password = "";
$dbname = "esercizioLavoratoriaziende";

$conn = new mysqli($hostname, $username, $password, $dbname);

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$dati = json_decode(file_get_contents("php://input"), true);

$id_Lavoratore = $dati["id_Lavoratore"];
$mansione_richiesta = $dati["mansione_richiesta"];
$specializzazione = $dati["specializzazione"];

$specializzazione = substr($specializzazione, 0, -2);

$specializzazione = $specializzazione."i";

$specializzazione = strtolower($specializzazione);

$queryGetIdAzienda = "SELECT id_Azienda FROM aziende WHERE specializzazione = ?";
$stmt = $conn->prepare($queryGetIdAzienda);
$stmt->bind_param("s", $specializzazione);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$id_azienda = $row["id_Azienda"];

$id_azienda = intval($id_azienda);
$id_Lavoratore = intval($id_Lavoratore);

$query = "INSERT INTO dbInterventi (id_azienda, id_lavoratore, mansioneRichiesta) VALUES (?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("iis", $id_azienda, $id_Lavoratore, $mansione_richiesta);
$stmt->execute();

echo "Intervento inserito";
?>