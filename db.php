<?php
namespace Medoo; // Mantén el namespace de Medoo si es necesario.

require 'Medoo.php'; // Cambia la ruta si "Medoo.php" está en otro directorio.

ini_set('display_errors', 0); // No mostrar errores en la salida
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE); // Reportar todos los errores menos warnings y notices


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