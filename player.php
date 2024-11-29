<?php
require 'db.php'; // Asegúrate de incluir correctamente la conexión a la base de datos
$message = ""; // Variable para almacenar mensajes

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $playerName = trim($_POST['player_name'] ?? '');
    $score = (int) ($_POST['score'] ?? 0); // Convertir score a un valor numérico

    // Validación de campos vacíos
    if (empty($playerName)) {
        $message = "El nombre del jugador es obligatorio.";
    } elseif (empty($score) && $score !== 0) { // Verifica si el score está vacío o no es un número
        $message = "El puntaje es obligatorio.";
    } else {
        // Inserta el nuevo jugador usando Medoo
        try {
            // Usamos el método insert de Medoo
            $database->insert("tb_players", [
                "player_name" => $playerName,
                "player_score" => $score
            ]);

            // Redirige al ranking después de insertar los datos


        } catch (Exception $e) {
            // Asigna un mensaje genérico en lugar de mostrar el error exacto
            $message = "Ocurrió un error al registrar al jugador. Por favor, inténtalo más tarde.";
        }
    }
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
                <h2 class="card-title">Register Player</h2>
                <div class="card-content">

                    <!-- Muestra mensajes aquí -->
                    <?php if (!empty($message)): ?>
                        <div class="error">
                            <?php echo htmlspecialchars($message); ?>
                        </div>
                    <?php endif; ?>

                    <form action="player.php" method="POST">
                        <!-- Campo de nombre de jugador -->
                        <label for="player_name">Player Name:</label>
                        <input type="text" id="player_name" name="player_name" placeholder="Enter your player name"
                            required>
                        <br><br>

                        <!-- Campo de puntaje -->
                        <label for="score">Score:</label>
                        <input type="number" id="score" name="score" placeholder="Enter your score" required>
                        <br><br>

                        <!-- Botón de registro -->
                        <button type="submit" class="login-button">Register</button>
                    </form>
                    <button class="other-button" onclick="window.location.href='ranking.php';">Ranking</button>
                    <button class="other-button" onclick="window.location.href='players.php';">Players list</button>
                    <button class="other-button" onclick="window.location.href='player_update.php';">Players
                        editor</button>
                </div>
                <a href="dekstop.php" class="register-link">Back to dekstop</a>
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
    <script src="./js/menu.js"></script>
</body>

</html>