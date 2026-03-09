<?php
    if($_SERVER["REQUEST_METHOD"] != "POST") {
        die("Pagina non raggiungibile");
    }else{
        $hostname = "localhost";
        $username = "root";
        $password = "";
        $dbname = "esercizioLavoratoriAziende";
        
        $conn = new mysqli($hostname, $username, $password, $dbname);
        
        if($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
    
        $dati = json_decode(file_get_contents("php://input"), true);
    
        $username = $dati["username"];
        $password = $dati["password"];
    
        $sql = "SELECT * FROM users WHERE username = ? AND pwd = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $username, $password);
        $stmt->execute();
        $result = $stmt->get_result();
    
        if($result->num_rows > 0) {
            if($username == "admin" && $password == "admin") {
                echo json_encode("OK ADMIN");
            }else{
                echo json_encode("OK");
            }
        }else{
            echo json_encode("NO");
        }
    }
?>