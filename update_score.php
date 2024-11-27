<?php
// Habilitar la visualización de errores
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Conexión a la base de datos
require 'db.php'; // Asegúrate de que este archivo conecta correctamente

// Verificar que la solicitud sea POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos enviados desde el cliente
    $username = $_POST['username']; // Cambiar según cómo identificas al jugador
    $score = (int) $_POST['score'];

    if ($username && $score >= 0) {
        try {
            // Actualizar el puntaje en la base de datos
            $database->update("users", [
                "score" => $score
            ], [
                "username" => $username
            ]);

            // Respuesta JSON al cliente
            echo json_encode(["success" => true, "message" => "Score updated successfully"]);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid data provided"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>