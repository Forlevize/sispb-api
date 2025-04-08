
<?php
class Usuario {
    private $conn;
    private $table_name = "usuarios";
    
    public $id;
    public $nome;
    public $email;
    public $senha;
    public $nivel_acesso;
    public $unidade_id;
    public $ultimo_acesso;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Verificar login
    public function login() {
        $query = "SELECT id, nome, email, senha, nivel_acesso, unidade_id, ultimo_acesso 
                FROM " . $this->table_name . " 
                WHERE email = :email AND status = 'Ativo'";
        
        $stmt = $this->conn->prepare($query);
        $this->email = htmlspecialchars(strip_tags($this->email));
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();
        
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->nome = $row['nome'];
            $this->senha = $row['senha'];
            $this->nivel_acesso = $row['nivel_acesso'];
            $this->unidade_id = $row['unidade_id'];
            $this->ultimo_acesso = $row['ultimo_acesso'];
            
            return true;
        }
        
        return false;
    }
    
    // Atualizar último acesso
    public function updateLastAccess() {
        $query = "UPDATE " . $this->table_name . " 
                SET ultimo_acesso = NOW() 
                WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }
    
    // Registrar log de acesso
    public function logAccess($ip) {
        $query = "INSERT INTO logs (usuario_id, acao, ip) 
                VALUES (:usuario_id, 'Login no sistema', :ip)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':usuario_id', $this->id);
        $stmt->bindParam(':ip', $ip);
        
        $stmt->execute();
    }
}
?>
