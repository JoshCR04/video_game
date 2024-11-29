<?php
require './db.php';

date_default_timezone_set('America/Costa_Rica');

// Verificar si los datos son JSON
if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    // Decodificar el contenido JSON recibido
    $data = json_decode(file_get_contents('php://input'), true);

    // Verificar si los datos contienen las claves necesarias
    if (isset($data['length'], $data['browser'], $data['screen'], $data['level'], $data['closed'])) {
        // Insertar los datos en la base de datos
        $database->insert("tb_tracking", [
            "length" => $data['length'],
            "device_type" => $data['browser'],
            "screen_size" => $data['screen'],
            "level" => $data['level'],
            "has_closed_browser" => $data['closed'],
            "date" => date('Y-m-d H:i:s')
        ]);

        // Responder con un mensaje de éxito
        $message = "Tracking data saved successfully!";
        echo json_encode(["message" => $message]);
    } else {
        // Responder si faltan datos
        echo json_encode(["message" => "Missing required data"]);
    }
} else {
    echo json_encode(["message" => "Invalid content type"]);
}
?>