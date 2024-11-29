<?php
session_start();
require 'db.php'; // Conexión con Medoo

// Destruir la sesión
session_unset();
session_destroy();

// Redirigir al login 
header("Location: login.php");
exit();
?>