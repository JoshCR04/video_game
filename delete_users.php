<?php
require 'db.php'; // Incluye la conexión a la base de datos

// Verifica si el id del usuario está presente
if (isset($_GET['delete'])) {
    $userId = $_GET['delete'];

    // Eliminar el usuario con ese ID
    $database->delete("users", [
        "id" => $userId
    ]);

    // Redirigir de vuelta a la lista de usuarios después de eliminar
    header("Location: users.php");
    exit;
} else {
    // Si no se pasa un ID, redirige de vuelta
    header("Location: users.php");
    exit;
}
?>
