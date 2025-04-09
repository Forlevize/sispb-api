FROM php:8.5-apache

# Instala as dependências necessárias para PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev

# Instala a extensão PDO para PostgreSQL
RUN docker-php-ext-install pdo pdo_pgsql

# Configura o ServerName para evitar avisos do Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Copia o conteúdo da pasta "api" para o diretório do Apache
COPY api/ /var/www/html/

# Habilita o mod_rewrite
RUN a2enmod rewrite

EXPOSE 80

CMD ["apache2-foreground"]
