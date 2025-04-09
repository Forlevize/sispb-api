# Usa a imagem oficial do PHP 8.1 com Apache
FROM php:8.1-apache

# Instala a extensão PDO para PostgreSQL, já que você está conectando ao Supabase
RUN docker-php-ext-install pdo pdo_pgsql

# Copia o conteúdo da pasta "api" (que contém sua aplicação PHP) para o diretório padrão do Apache
COPY api/ /var/www/html/

# Habilita o mod_rewrite para URLs amigáveis, se necessário
RUN a2enmod rewrite

# Expõe a porta 80, que é a porta padrão do Apache
EXPOSE 80

# Inicia o Apache em primeiro plano
CMD ["apache2-foreground"]
