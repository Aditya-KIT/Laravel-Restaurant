<?php
$host = '127.0.0.1';
$port = '3307';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connected successfully to MySQL.\n";
    
    $pdo->exec("CREATE DATABASE IF NOT EXISTS restaurant_db");
    echo "Database restaurant_db ensured.\n";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
