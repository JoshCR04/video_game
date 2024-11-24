<?php
namespace Medoo; // Mantén el namespace de Medoo si es necesario.

require 'Medoo.php'; // Cambia la ruta si "Medoo.php" está en otro directorio.

if (!isset($database)) {
    $database = new Medoo([
        'type' => 'mysql',
        'host' => 'localhost',
        'database' => 'video_game',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8' // Recomendado para manejar caracteres especiales
    ]);
}

?>