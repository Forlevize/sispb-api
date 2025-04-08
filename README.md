
# SISPB - Sistema Interno de Controle de Boletos

Sistema desenvolvido para as Farmácias Preço Baixo Maranhão para centralizar a gestão de boletos, pagamentos, cotações, documentos internos, unidades, operadores, relatórios e fluxos de confirmação.

## Configuração do Ambiente

### Requisitos
- XAMPP (PHP 7.4+ e MySQL)
- Node.js e NPM

### Instalação

#### Backend (PHP/MySQL)
1. Inicie o XAMPP e certifique-se que Apache e MySQL estão rodando
2. Navegue até `http://localhost/phpmyadmin/`
3. Crie um novo banco de dados chamado `sispb`
4. Importe o arquivo `api/sispb.sql`
5. Copie a pasta `api` para o diretório `htdocs` do XAMPP

#### Frontend (React)
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Acesse o sistema em `http://localhost:3000`

### Credenciais padrão
- Email: admin@farmaciaprecosbaixo.com.br
- Senha: admin123

## Estrutura do Sistema

O SISPB foi desenvolvido com as seguintes tecnologias e estruturas:

- **Frontend**: React.js, Tailwind CSS, Lucide Icons
- **Backend**: PHP com MySQL
- **Autenticação**: Sistema personalizado com tokens

## Módulos Principais

- Dashboard
- Lançamento de Boletos
- Listagem de Boletos
- Operadores
- Fornecedores
- Registros do Sistema (Logs)
- Chat Interno
- Relatórios

## Contato

Para suporte técnico: (98) 98256-7707
