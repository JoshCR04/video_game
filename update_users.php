<?php
require 'db.php'; // Incluye la conexión a la base de datos

// Verifica si el id del usuario está presente
if (isset($_GET['id'])) {
    $userId = $_GET['id'];

    // Consultar los datos del usuario con ese ID
    $user = $database->select("users", "*", ["id" => $userId]);

    // Si el usuario no existe
    if (empty($user)) {
        die("Usuario no encontrado.");
    }

    // Obtiene los datos del usuario
    $user = $user[0]; // Convertir el array en una única fila
} else {
    die("ID de usuario no proporcionado.");
}

// Manejo del formulario para actualizar los datos
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Recibir y sanitizar los datos
    $username = htmlspecialchars($_POST['username']);
    $email = htmlspecialchars($_POST['email']);

    // Actualizar los datos del usuario en la base de datos
    $database->update("users", [
        "username" => $username,
        "email" => $email
    ], [
        "id" => $userId
    ]);

    // Redirigir a la lista de usuarios después de la actualización
    header("Location: users.php");
    exit;
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

<body>
    <!-- Header Section -->
    <header class="header">
        <img src="./img/logo_final_1.png" alt="Game logo" class="logo-header" />

        <div class="menu-icon" onclick="toggleMenu()">
            <img src="./img/Menu.png" alt="Menu Icon" />
        </div>

        <nav class="nav-links" aria-label="Primary navigation">
            <a href="index.html"><img class="icons" src="./img/Home.png" alt="Home icon">Home</a>
            <a href="login.php"><img class="icons" src="./img/Login.png" alt="Login icon">Login</a>
            <a href="menu.php"><img class="icons" src="./img/Play_circle.png" alt="Play icon">Play</a>
            <a href="ranking.php"><img class="icons" src="./img/Users.png" alt="Ranking icon">Ranking</a>
            <a href="credits.html"><img class="icons" src="./img/Info.png" alt="Credits icon">Credits</a>
        </nav>
    </header>

    <!-- Main Content Section -->
    <main class="Log_Ran_Cred content">
        <div class="container">
            <div class="card">
                <!-- Título -->
                <h2 class="card-title">Edit Users</h2>

                <div class="ranking-content">
                    <!-- Formulario para editar usuarios -->
                    <form method="POST">
                        <!-- Campo para editar el nombre de usuario -->
                        <div class="form-group">
                            <label class="update-label" for="username">Username:</label>
                            <input type="text" name="username" id="username"
                                value="<?= htmlspecialchars($user['username']); ?>" required>
                        </div>

                        <!-- Campo para editar el email -->
                        <div class="form-group">
                            <label class="update-label" for="email">Email:</label>
                            <input type="email" name="email" id="email" value="<?= htmlspecialchars($user['email']); ?>"
                                required>
                        </div>

                        <!-- Botón para actualizar -->
                        <button type="submit" class="edit-button">Update User</button>
                    </form>

                    <!-- Enlace para volver a la lista de usuarios -->
                    <div class="table-card-footer">
                        <a class="register-link" href="users.php">Back to Users List</a>
                    </div>
                </div>
            </div>
        </div>
    </main>


    <!-- Footer Section -->
    <footer class="footer">
        <img src="./img/logo_final_2.png" alt="Game logo" class="logo-footer" />
        <nav class="nav-links-footer" aria-label="Footer navigation">
            <a href="https://github.com/JoshCR04/video_game"><img class="icons-footer" src="./img/Github.png"
                    alt="GitHub icon"></a>
            <a href="tel:+50689098222"><img class="icons-footer" src="./img/Phone.png" alt="Phone icon"></a>
            <a href="#"><img class="icons-footer" src="./img/Facebook.png" alt="Facebook icon"></a>
            <a href="#"><img class="icons-footer" src="./img/Instagram.png" alt="Instagram icon"></a>
            <a href="mailto:joshuacerdascr@gmail.com"><img class="icons-footer" src="./img/Mail.png"
                    alt="Mail icon"></a>
        </nav>
    </footer>
</body>
<script src="./js/menu.js"></script>

</html>