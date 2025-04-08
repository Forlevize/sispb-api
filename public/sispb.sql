
-- Criação do banco de dados SISPB
CREATE DATABASE IF NOT EXISTS sispb;
USE sispb;

-- Tabela de unidades
CREATE TABLE IF NOT EXISTS unidades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  endereco VARCHAR(200),
  cidade VARCHAR(100),
  uf CHAR(2),
  telefone VARCHAR(20),
  email VARCHAR(100),
  responsavel VARCHAR(100),
  status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir unidades de exemplo
INSERT INTO unidades (nome, endereco, cidade, uf, telefone, email, responsavel) VALUES
('Matriz São Luís', 'Av. Principal, 123', 'São Luís', 'MA', '(98) 3333-4444', 'matriz@farmaciapreco.com.br', 'Emanuel Neres'),
('Filial Imperatriz', 'Rua Central, 456', 'Imperatriz', 'MA', '(99) 3333-5555', 'imperatriz@farmaciapreco.com.br', 'Maria Silva');

-- Tabela de usuários/operadores
CREATE TABLE IF NOT EXISTS usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  rg VARCHAR(20),
  endereco VARCHAR(200),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  uf CHAR(2),
  cep VARCHAR(10),
  telefone VARCHAR(20),
  nivel_acesso ENUM('admin', 'financeiro', 'farmaceutico', 'balconista') NOT NULL,
  unidade_id INT,
  observacoes TEXT,
  status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
  ultimo_acesso DATETIME,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unidade_id) REFERENCES unidades(id)
);

-- Inserir usuário administrador padrão (senha: admin123)
INSERT INTO usuarios (nome, email, senha, nivel_acesso, unidade_id, ultimo_acesso) VALUES
('EMANUEL DE MORAES NERES', 'admin@farmaciapreco.com.br', '$2y$10$PeWmW9.yBgQXuP2k1BqEbOALJvpPt6ZAFcGtQtN6pGfM57g.Q9rSq', 'admin', 1, NOW());

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  razao_social VARCHAR(200) NOT NULL,
  nome_fantasia VARCHAR(200),
  cnpj_cpf VARCHAR(18) UNIQUE,
  endereco VARCHAR(200),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  uf CHAR(2),
  cep VARCHAR(10),
  email VARCHAR(100),
  telefone VARCHAR(20),
  celular VARCHAR(20),
  observacoes TEXT,
  status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir fornecedor de exemplo
INSERT INTO fornecedores (razao_social, nome_fantasia, cnpj_cpf, cidade, uf) VALUES
('DISTRIBUIDORA DE MEDICAMENTOS LTDA', 'FARMA DISTRIBUIDORA', '12.345.678/0001-90', 'São Paulo', 'SP');

-- Tabela de grupos (para classificação de boletos)
CREATE TABLE IF NOT EXISTS grupos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir grupos de exemplo
INSERT INTO grupos (nome, descricao) VALUES
('Medicamentos', 'Boletos referentes a compras de medicamentos'),
('Material de Expediente', 'Boletos de materiais de escritório e expediente'),
('Equipamentos', 'Boletos de equipamentos e mobiliário');

-- Tabela de boletos
CREATE TABLE IF NOT EXISTS boletos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  unidade_id INT NOT NULL,
  fornecedor_id INT NOT NULL,
  usuario_id INT NOT NULL,
  grupo_id INT,
  tipo ENUM('Novo', 'Antigo') DEFAULT 'Novo',
  linha_digitavel VARCHAR(255) UNIQUE,
  referencia VARCHAR(100),
  valor DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  valor_pago DECIMAL(10,2),
  nota_fiscal VARCHAR(255),
  situacao ENUM('Pendente', 'Pago') DEFAULT 'Pendente',
  reembolso BOOLEAN DEFAULT false,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unidade_id) REFERENCES unidades(id),
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (grupo_id) REFERENCES grupos(id)
);

-- Tabela de logs do sistema
CREATE TABLE IF NOT EXISTS logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  acao VARCHAR(255) NOT NULL,
  tabela VARCHAR(50),
  registro_id INT,
  detalhes TEXT,
  ip VARCHAR(45),
  data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabela de mensagens do chat
CREATE TABLE IF NOT EXISTS mensagens_chat (
  id INT PRIMARY KEY AUTO_INCREMENT,
  remetente_id INT NOT NULL,
  destinatario_id INT,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (remetente_id) REFERENCES usuarios(id),
  FOREIGN KEY (destinatario_id) REFERENCES usuarios(id)
);
