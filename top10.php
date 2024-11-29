<?php
require 'db.php'; // Incluye tu archivo de conexión con Medoo

// Realizamos la consulta SQL personalizada para obtener los 10 mejores jugadores desde tb_players
$sql = "SELECT player_name, player_score FROM tb_players ORDER BY player_score DESC LIMIT 10";
$top_players = $database->query($sql)->fetchAll();


header('Content-Type: application/json');
echo json_encode($top_players, JSON_PRETTY_PRINT);

// Función para convertir los segundos a formato H:M:S
function formatTime($seconds)
{
    $hours = floor($seconds / 3600);
    $minutes = floor(($seconds % 3600) / 60);
    $seconds = $seconds % 60;

    return sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);
}

?>