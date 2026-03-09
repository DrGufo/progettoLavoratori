<?php
$hostname = "localhost";
$username = "root";
$password = "";
$dbname = "esercizioLavoratori";

$conn = new mysqli($hostname, $username, $password, $dbname);           

if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$mansione = $_GET["mansione"];

$query = "SELECT * FROM dbmuratori WHERE mansione = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $mansione);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

$sql = "UPDATE dbmuratori SET disponibilita = FALSE WHERE mansione = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $mansione);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode($row);
?>