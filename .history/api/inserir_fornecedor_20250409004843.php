<?php
header('Content-Type: application/json');

// Inclui o arquivo de configuração do banco de dados
require_once 'config/Database.php';

$database = new Database();
$conn = $database->getConnection();

// Lê os dados enviados via POST (JSON)
$data = json_decode(file_get_contents("php://input"));

if ($data) {
    $nome = isset($data->nome) ? trim($data->nome) : "";
    $cnpj = isset($data->cnpj) ? trim($data->cnpj) : "";
    $telefone = isset($data->telefone) ? trim($data->telefone) : "";
    $email = isset($data->email) ? trim($data->email) : "";
    $endereco = isset($data->endereco) ? trim($data->endereco) : "";
    $contato = isset($data->contato) ? trim($data->contato) : "";

    // Checa campos obrigatórios: nome e cnpj
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
