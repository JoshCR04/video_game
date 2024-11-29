<?php
require '../db.php';

if ($_GET) {
    $data = $database->select("tb_game_config", "*", [
        "id_game_config" => $_GET['id']
    ]);



    $response = $data[0]["game_data"];

    $response = json_decode($response, true);
    echo json_encode($response, JSON_PRETTY_PRINT);
}
?>