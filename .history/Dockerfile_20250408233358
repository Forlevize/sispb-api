# Usa a imagem oficial do PHP com Apache
FROM php:8.1-apache

# Atualiza o sistema e instala a biblioteca do PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev

# Instala as extensões PHP necessárias (PDO para PostgreSQL)
RUN docker-php-ext-install pdo pdo_pgsql

# Copia o conteúdo da pasta "api" para o diretório padrão do Apache
COPY api/ /var/www/html/

# Habilita o mod_rewrite (útil para URLs amigáveis)
RUN a2enmod rewrite

# Exponha a porta 80 para acesso HTTP
EXPOSE 80

# Comando para iniciar o Apache em primeiro plano
CMD ["apache2-foreground"]
