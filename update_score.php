<?php


require 'db.php'; // Asegúrate de que este archivo conecta correctamente

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener datos enviados desde el cliente
    $user_id = (int) $_POST['user_id']; // ID del usuario
    $score = (int) $_POST['score'];

    if ($user_id && $score >= 0) {
        try {
            // Actualizar el puntaje en la base de datos
            $database->update("users", [
                "score" => $score
            ], [
                "id" => $user_id
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