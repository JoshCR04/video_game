<?php
session_start();

// Verificar si la sesión está activa
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

// Verificar tiempo de inactividad (ejemplo: 15 minutos)
$inactive = 900; // 900 segundos = 15 minutos
if (isset($_SESSION['start_time']) && (time() - $_SESSION['start_time']) > $inactive) {
    // Cerrar sesión por inactividad
    session_unset();
    session_destroy();
    header("Location: login.php?timeout=true");
    exit;
}

// Actualizar el tiempo de inicio
$_SESSION['start_time'] = time();
?>