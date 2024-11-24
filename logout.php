<?php
session_start();
require 'db.php'; // Conexión con Medoo

if (isset($_SESSION["user_id"], $_SESSION["login_time"])) {
    $session_duration = time() - $_SESSION["login_time"]; // Calcular duración
    $user_id = $_SESSION["user_id"];

    // Actualizar el tiempo acumulado usando Medoo
    $database->update("users", [
        "session_time[+]" => $session_duration // Incrementar tiempo acumulado
    ], [
        "id" => $user_id
    ]);
}

// Destruir la sesión
session_unset();
session_destroy();

// Redirigir al login
header("Location: login.php");
exit();
?>