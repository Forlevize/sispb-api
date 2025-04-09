<?php
// Configurar o cabeçalho da resposta para JSON
header('Content-Type: application/json');

// Incluir a configuração do banco de dados
require_once 'config/Database.php';

// Cria uma instância do banco de dados e obtém a conexão
$database = new Database();
$conn = $database->getConnection();

// Lê os dados enviados via POST (esperando JSON no corpo da requisição)
$data = json_decode(file_get_contents("php://input"));

if ($data) {
    // Extraia os dados, verifique e limpe se necessário
    $nome             = isset($data->nome) ? trim($data->nome) : "";
    $cnpj             = isset($data->cnpj) ? trim($data->cnpj) : "";
    $telefone         = isset($data->telefone) ? trim($data->telefone) : "";
    $endereco         = isset($data->endereco) ? trim($data->endereco) : "";
    $email            = isset($data->email) ? trim($data->email) : "";
    $contato_principal= isset($data->contato_principal) ? trim($data->contato_principal) : "";
    
    // Verifique se o campo obrigatório "nome" está preenchido
    if (empty($nome)) {
        echo json_encode([
            "status"  => "error",
            "message" => "O campo 'nome' é obrigatório."
        ]);
        exit;
    }
    
    // Prepara a consulta SQL para inserir os dados
    $query = "INSERT INTO fornecedores (nome, cnpj, telefone, endereco, email, contato_principal)
              VALUES (:nome, :cnpj, :telefone, :endereco, :email, :contato_principal)";
    
    $stmt = $conn->prepare($query);
    // Vincula os parâmetros à consulta
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':cnpj', $cnpj);
    $stmt->bindParam(':telefone', $telefone);
    $stmt->bindParam(':endereco', $endereco);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':contato_principal', $contato_principal);
    
    // Executa a consulta e retorna a resposta apropriada
    if ($stmt->execute()) {
        echo json_encode([
            "status"  => "success",
            "message" => "Fornecedor cadastrado com sucesso."
        ]);
    } else {
        // Se houver erro na execução, retorne uma mensagem de erro
        echo json_encode([
            "status"  => "error",
            "message" => "Falha ao cadastrar o fornecedor."
        ]);
    }
} else {
    echo json_encode([
        "status"  => "error",
        "message" => "Dados inválidos."
    ]);
}
?>
