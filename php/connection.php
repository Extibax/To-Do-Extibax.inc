<?php

echo "Hola";

require dirname(__DIR__) . '/vendor/autoload.php';
$main_path = dirname(__DIR__);

$dotenv = Dotenv\Dotenv::create($main_path);
$dotenv->load();

$HOST = $_ENV['HOST'];
$USER = $_ENV['USER'];
$PASS = $_ENV['PASS'];
$DB = $_ENV['DB'];

$connection = mysqli_connect(
    $HOST,
    $USER,
    $PASS,
    $DB
);

mysqli_set_charset($connection, "utf8");

if ($connection) {
    session_start();
}

?>
