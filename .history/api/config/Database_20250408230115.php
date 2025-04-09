<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    private $conn;
    
    public function __construct() {
        // Se as variáveis de ambiente não estiverem definidas, usar os valores padrão do Railway.
        $this->host = getenv('PGHOST') ?: 'switchyard.proxy.rlwy.net';
        $this->db_name = getenv('PGDATABASE') ?: 'railway';
        $this->username = getenv('PGUSER') ?: 'postgres';
        $this->password = getenv('PGPASSWORD') ?: 'GsvaXuzcSuzOsFRHZbzZGOiqDBCqUQao';
        $this->port = getenv('PGPORT') ?: 48938;
    }
    
    public function getConnection() {
        $this->conn = null;
        try {
            // Constrói o DSN para PostgreSQL e força o uso de SSL
            $dsn = "pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";sslmode=require";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Erro na conexão: " . $e->getMessage();
        }
        return $this->conn;
    }
}
?>
