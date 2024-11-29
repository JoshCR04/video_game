<?php
require '../db.php';

if ($_GET) {
    // Si se recibe un parámetro 'id' por GET, eliminar el registro correspondiente
    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        // Eliminar el registro de la base de datos
        $database->delete("tb_game_config", [
            "id_game_config" => $id
        ]);

        // Redirigir después de eliminar el registro
        header("Location: ./index.php");
        exit();
    }
}

if ($_POST) {
    date_default_timezone_set('America/Costa_Rica');

    // Actualizar el registro
    $database->update("tb_game_config", [
        "game_data" => $_POST['data'],
        "update_at" => date('Y-m-d H:i:s')
    ], [
        "id_game_config" => $_POST['id'],
    ]);

    // Redirigir después de actualizar
    header("Location: ./index.php");
    exit();
}
?>