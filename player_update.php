<?php
require 'db.php'; // Asegúrate de que tu conexión a la base de datos es correcta

// Variable para manejar los mensajes
$message = "";

// Si el formulario se ha enviado para actualizar el jugador
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['id_player'])) {
    // Recibir y sanitizar los datos del formulario
    $player_name = htmlspecialchars($_POST['player_name']);
    $player_score = htmlspecialchars($_POST['player_score']);
    $player_id = $_POST['id_player'];

    // Actualizar los datos del jugador en la base de datos
    $database->update("tb_players", [
        "player_name" => $player_name,
        "player_score" => $player_score
    ], [
        "id_player" => $player_id
    ]);

    // Mostrar mensaje de éxito sin redirigir
    $message = "Jugador actualizado correctamente.";
}

// Consultar todos los jugadores para la lista
$players = $database->select("tb_players", "*");

// Si el ID del jugador está en la URL o en el formulario, lo usamos para cargar los datos
$playerToEdit = null;
if (isset($_GET['id_player'])) {
    $playerId = $_GET['id_player'];
    // Consultar los datos del jugador para la edición
    $playerToEdit = $database->select("tb_players", "*", ["id_player" => $playerId]);
    if (empty($playerToEdit)) {
        die("Jugador no encontrado.");
    }
    $playerToEdit = $playerToEdit[0]; // Solo tomar el primer jugador
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
    <main class="Log_Ran_Cred content">
        <div class="container">
            <div class="card">
                <!-- Título -->
                <h2 class="card-title">Ranking de Jugadores</h2>

                <div class="card-content">
                    <!-- Mostrar mensaje de éxito si el jugador fue actualizado -->
                    <?php if ($message): ?>
                        <div class="success-message">
                            <p><?= htmlspecialchars($message); ?></p>
                        </div>
                    <?php endif; ?>

                    <!-- Tabla de jugadores -->
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre del Jugador</th>
                                <th>Puntuación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($players as $player): ?>
                                <tr>
                                    <td><?= htmlspecialchars($player['player_name']); ?></td>
                                    <td><?= htmlspecialchars($player['player_score']); ?></td>
                                    <td>
                                        <!-- Botón de editar que pasa el id del jugador -->
                                        <a href="player_update.php?id_player=<?= $player['id_player']; ?>"
                                            class="edit-button">Editar</a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>

                    <!-- Formulario de edición si se ha seleccionado un jugador para editar -->
                    <?php if ($playerToEdit): ?>
                        <h5>Editar Jugador</h5>
                        <form method="POST" action="player_update.php">
                            <!-- Campo oculto con el ID del jugador -->
                            <input type="hidden" name="id_player" value="<?= $playerToEdit['id_player']; ?>">

                            <div class="form-group">
                                <label for="player_name">Nombre del Jugador:</label>
                                <input type="text" name="player_name" id="player_name"
                                    value="<?= htmlspecialchars($playerToEdit['player_name']); ?>" required>
                            </div>

                            <div class="form-group">
                                <label for="player_score">Puntuación:</label>
                                <input type="number" name="player_score" id="player_score"
                                    value="<?= htmlspecialchars($playerToEdit['player_score']); ?>" required>
                            </div>

                            <button type="submit" class="login-button">Actualizar Jugador</button>
                        </form>
                    <?php endif; ?>

                    <!-- Pie de la tarjeta con enlace de regreso -->
                    <div class="card-footer">
                        <a href="player.php" class="register-link">Regresar al registro de jugadores</a>
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