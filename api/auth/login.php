
<?php
// Cabeçalhos HTTP necessários
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Incluir arquivos de configuração e modelo
include_once '../config/Database.php';
include_once '../models/Usuario.php';

// Obter conexão com o banco de dados
$database = new Database();
$db = $database->getConnection();

// Instanciar objeto de usuário
$usuario = new Usuario($db);

// Obter dados enviados
$data = json_decode(file_get_contents("php://input"));

// Verificar se dados foram enviados
if(!empty($data->email) && !empty($data->senha)) {
    $usuario->email = $data->email;
    
    // Verificar se o usuário existe
    if($usuario->login()) {
        // Verificar a senha
        if(password_verify($data->senha, $usuario->senha)) {
            // Gerar token simples (em produção, usar JWT ou outra solução mais segura)
            $token = bin2hex(random_bytes(32));
            
            // Atualizar último acesso
            $usuario->updateLastAccess();
            
            // Registrar log de acesso
            $ip = $_SERVER['REMOTE_ADDR'];
            $usuario->logAccess($ip);
            
            // Resposta
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "mensagem" => "Login realizado com sucesso.",
                "token" => $token,
                "usuario" => array(
                    "id" => $usuario->id,
                    "nome" => $usuario->nome,
                    "email" => $usuario->email,
                    "nivel_acesso" => $usuario->nivel_acesso,
                    "unidade_id" => $usuario->unidade_id,
                    "ultimo_acesso" => $usuario->ultimo_acesso
                )
            ));
        } else {
            // Senha incorreta
            http_response_code(401);
            echo json_encode(array(
                "success" => false,
                "mensagem" => "Senha incorreta."
            ));
        }
    } else {
        // Usuário não encontrado
        http_response_code(404);
        echo json_encode(array(
            "success" => false,
            "mensagem" => "Usuário não encontrado ou inativo."
        ));
    }
} else {
    // Dados incompletos
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "mensagem" => "Dados incompletos. E-mail e senha são obrigatórios."
    ));
}
?>
