<?php
// ATIVAR A EXIBIÇÃO DE ERROS (use APENAS em ambiente de DESENVOLVIMENTO)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Cabeçalhos CORS para permitir acesso de qualquer origem
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Se for uma requisição OPTIONS (preflight), encerra sem processar
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Define o tipo de conteúdo como JSON
header('Content-Type: application/json');

require_once 'config/Database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if ($data) {
    $nome = isset($data->nome) ? trim($data->nome) : "";
    $cnpj = isset($data->cnpj) ? trim($data->cnpj) : "";
    $telefone = isset($data->telefone) ? trim($data->telefone) : "";
    $email = isset($data->email) ? trim($data->email) : "";
    $endereco = isset($data->endereco) ? trim($data->endereco) : "";
    $contato = isset($data->contato) ? trim($data->contato) : "";

    if (empty($nome) || empty($cnpj)) {
        echo json_encode([
            "status" => "error",
            "message" => "Campos 'nome' e 'cnpj' são obrigatórios."
        ]);
        exit;
    }

    $query = "INSERT INTO fornecedores (nome, cnpj, telefone, email, endereco, contato_principal) 
              VALUES (:nome, :cnpj, :telefone, :email, :endereco, :contato)";
    $stmt = $conn->prepare($query);

    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':cnpj', $cnpj);
    $stmt->bindParam(':telefone', $telefone);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':endereco', $endereco);
    $stmt->bindParam(':contato', $contato);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Fornecedor cadastrado com sucesso."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Falha ao cadastrar o fornecedor."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Dados inválidos."
    ]);
}
?>
