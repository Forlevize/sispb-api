<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;
    
    // O construtor obtém os valores das variáveis de ambiente,
    // caso não existam, usa os valores padrões (úteis para desenvolvimento local).
    public function __construct() {
        $this->host = getenv('MYSQLHOST') ?: 'localhost';
        $this->db_name = getenv('MYSQLDATABASE') ?: 'sispb';
        $this->username = getenv('MYSQLUSER') ?: 'root';
        $this->password = getenv('MYSQLPASSWORD') ?: '';
    }
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Erro na conexão: " . $e->getMessage();
        }
        
        return $this->conn;
    }
}
?>
