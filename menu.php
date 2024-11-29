<?php
session_start();
require 'db.php'; // Conexión a tu base de datos

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION["user_id"])) {
  header("Location: login.php");
  exit();
}

// Obtener información del usuario
$user = $database->get("users", "*", [
  "id" => $_SESSION["user_id"]
]);

if ($user !== null) {
  echo "Bienvenido, " . $_SESSION["username"] . "!";
} else {
  echo "No se encontró información del usuario.";
}
?>


<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Video Game Site</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/main.css">
  <meta name="description" content="A video game site offering play, ranking, and credits">

  <meta property="og:title" content="Video Game Site">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yourwebsite.com">
  <meta property="og:image" content="./img/banner.png">
  <meta property="og:image:alt" content="Video game banner">

  <link rel="icon" href="/img/logo_final_2.png" sizes="any" class="icon-small">
  <link rel="icon" href="/img/logo_final_2.png" type="image/svg+xml" class="icon-small">
  <link rel="apple-touch-icon" href="/img/logo_final_2.png" class="icon-small">

  <meta name="theme-color" content="#fafafa">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
    rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Federant&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Karantina:wght@300;400;700&display=swap" rel="stylesheet">
  <link
    href="https://fonts.googleapis.com/css2?family=Neuton:ital,wght@0,200;0,300;0,400;0,700;0,800;1,400&display=swap"
    rel="stylesheet">
</head>


<body class="fondo">


  <header>

    <img class="logo_menu" src="./img/logo.png" alt="Game Logo" />

  </header>
  <div class="orientation-message">
    Please rotate your device
  </div>
  <nav>
    <ul class="menu-section menu">
      <li class="buttons">
        <a href="game.html">start adventure</a>
      </li>
      <li class="buttons">
        <a href="index.html">home</a>
      </li>
    </ul>
  </nav>
</body>

</html>