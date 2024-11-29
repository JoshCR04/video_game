<?php
require '../db.php';


$configs = $database->select("tb_game_config", "*");






?>


<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Video Game Site</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/main.css">
    <meta name="description" content="A video game site offering play, ranking, and credits">

    <meta property="og:title" content="Video Game Site">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://yourwebsite.com">
    <meta property="og:image" content="./img/banner.png">
    <meta property="og:image:alt" content="Video game banner">

    <link rel="icon" href="/img/logo_final_2.png" sizes="any" class="icon-small">
    <link rel="icon" href="/img/logo_final_2.png" type="image/svg+xml" class="icon-small">
    <link rel="apple-touch-icon" href="/img/logo_final_2.png" class="icon-small">

    <link rel="manifest" href="site.webmanifest">
    <meta name="theme-color" content="#fafafa">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Federant&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Karantina:wght@300;400;700&display=swap" rel="stylesheet">
    <link
        href="https://fonts.googleapis.com/css2?family=Neuton:ital,wght@0,200;0,300;0,400;0,700;0,800;1,400&display=swap"
        rel="stylesheet">
</head>


<body>
    <h1>Registered Game- configs</h1>
    <a href="./add.php">Create New JSON</a>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>Create at</th>
            <th>Update at</th>
            <th>Actions</th>

        </tr>

        <?php
        foreach ($configs as $config) {
            echo "
      <tr>
        <td>GC-{$config['id_game_config']}</td>
        <td>{$config['create_at']}</td>
        <td>{$config['update_at']}</td>
        <td>
             <a target='blank' href='api.php?id={$config['id_game_config']}'>view</a>
            <a href='edit.php?id={$config['id_game_config']}'>Edit</a> |
            <a href='delete.php?id={$config['id_game_config']}'>Delete</a>
        </td>
      </tr>
    ";
        }
        ?>

        <a href="../users.php">Back</a>



</body>

</html>