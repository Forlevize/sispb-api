
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS sispb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sispb;

-- Tabela de unidades
CREATE TABLE IF NOT EXISTS unidades (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  endereco VARCHAR(255),
  cidade VARCHAR(100),
  uf CHAR(2),
  telefone VARCHAR(20),
  responsavel VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserir algumas unidades para teste
INSERT INTO unidades (nome, endereco, cidade, uf, telefone, responsavel) VALUES
('Unidade São Luís Centro', 'Rua Grande, 123', 'São Luís', 'MA', '(98) 3232-1234', 'Maria Silva'),
('Unidade São Luís Cohab', 'Av. Jerônimo de Albuquerque, 456', 'São Luís', 'MA', '(98) 3232-5678', 'João Santos');

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  nivel_acesso ENUM('admin', 'financeiro', 'farmaceutico', 'balconista_i', 'balconista_ii') NOT NULL,
  unidade_id INT(11) NOT NULL,
  ultimo_acesso DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unidade_id) REFERENCES unidades(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserir um usuário administrador para teste (senha: admin123)
INSERT INTO usuarios (nome, email, senha, nivel_acesso, unidade_id) VALUES
('EMANUEL DE MORAES NERES', 'admin@farmaciaprecosbaixo.com.br', '$2y$10$H8O9qAUQnNJr5ySzOUUbR.HfbQdb3ARb8xQqXQJLYWZG69NGP/zPe', 'admin', 1);

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  razao_social VARCHAR(200) NOT NULL,
  nome_fantasia VARCHAR(200),
  cpf_cnpj VARCHAR(20) NOT NULL UNIQUE,
  endereco VARCHAR(255),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  uf CHAR(2),
  cep VARCHAR(10),
  email VARCHAR(100),
  telefone VARCHAR(20),
  celular VARCHAR(20),
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de grupos de boletos
CREATE TABLE IF NOT EXISTS grupos (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Inserir alguns grupos para teste
INSERT INTO grupos (nome, descricao) VALUES
('Medicamentos', 'Boletos referentes a compra de medicamentos'),
('Cosméticos', 'Boletos referentes a compra de cosméticos'),
('Equipamentos', 'Boletos referentes a compra de equipamentos'),
('Serviços', 'Boletos referentes a serviços contratados');

-- Tabela de boletos
CREATE TABLE IF NOT EXISTS boletos (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  unidade_id INT(11) NOT NULL,
  fornecedor_id INT(11) NOT NULL,
  tipo ENUM('novo', 'antigo') NOT NULL,
  grupo_id INT(11) NOT NULL,
  linha_digitavel VARCHAR(255) NOT NULL UNIQUE,
  referencia VARCHAR(100),
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  valor_pago DECIMAL(10,2),
  nota_fiscal VARCHAR(255),
  situacao ENUM('pendente', 'pago') NOT NULL DEFAULT 'pendente',
  para_reembolso TINYINT(1) DEFAULT 0,
  operador_id INT(11) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unidade_id) REFERENCES unidades(id),
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
  FOREIGN KEY (grupo_id) REFERENCES grupos(id),
  FOREIGN KEY (operador_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de registros (logs)
CREATE TABLE IF NOT EXISTS logs (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT(11) NOT NULL,
  acao VARCHAR(100) NOT NULL,
  descricao TEXT,
  ip VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de mensagens do chat
CREATE TABLE IF NOT EXISTS mensagens_chat (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  remetente_id INT(11) NOT NULL,
  destinatario_id INT(11),
  mensagem TEXT NOT NULL,
  lida TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (remetente_id) REFERENCES usuarios(id),
  FOREIGN KEY (destinatario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de produtos (para o sistema de Faltas)
CREATE TABLE IF NOT EXISTS produtos (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  codigo_barras VARCHAR(50) NOT NULL UNIQUE,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de faltas (registro de produtos em falta)
CREATE TABLE IF NOT EXISTS faltas (
  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  produto_id INT(11) NOT NULL,
  quantidade_solicitada INT(11) NOT NULL,
  quantidade_disponivel INT(11) DEFAULT 0,
  unidade_id INT(11) NOT NULL,
  operador_id INT(11) NOT NULL,
  status ENUM('Em Aberto', 'Solicitado', 'Em Cotação', 'Pedido Realizado', 'Recebido') NOT NULL DEFAULT 'Em Aberto',
  data_lancamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (produto_id) REFERENCES produtos(id),
  FOREIGN KEY (unidade_id) REFERENCES unidades(id),
  FOREIGN KEY (operador_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
