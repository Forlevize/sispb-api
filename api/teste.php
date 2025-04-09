<?php
// Define o cabeçalho como JSON
header('Content-Type: application/json');

// Inclui a configuração do banco de dados
require_once 'config/Database.php';

$database = new Database();
$conn = $database->getConnection();

if ($conn) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Conexão estabelecida com sucesso!'
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Falha na conexão.'
    ]);
}
?>
