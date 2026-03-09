<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <div id="content">
        <h1>Login</h1>
        <p>Esegui il login per accedere ai servizi della nostra azienda.</p>
        <input type="text" id="username" placeholder="Username">
        <input type="password" id="password" placeholder="Password">
        <button id="btnSubmit">Login</button>
    </div>
    <script>
        document.getElementById("btnSubmit").addEventListener("click", fetchLogin);

        function fetchLogin(){
            var inputUsername = document.getElementById("username");
            var inputPassword = document.getElementById("password");

            var username = inputUsername.value;
            var password = inputPassword.value;

            fetch("http://localhost/php/EsercizioLavoratori/backend/backLogin.php", {
                method: "POST",
                body: JSON.stringify({username: username, password: password})
            })
            .then(response => response.json())
            .then(data => {
                if(data == "OK ADMIN" || data == "OK"){
                    inputUsername.value = "";
                    inputPassword.value = "";
                    if(data == "OK ADMIN"){
                        window.open("http://localhost:3010");
                    }else if(data == "OK"){
                        window.open("http://localhost/php/EsercizioLavoratori/homepage.php?status=logged&username=" + username);
                    }
                }else{
                    alert("Credenziali errate");
                }
            });
        }
    </script>
    <style>
        body {
            background-color: #DEDDDC;
            font-family: Arial, sans-serif;
            font-size: 20px;
            margin: 0;
            padding: 0;
        }
        #content {
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
    </style>
</body>
</html>