# Usa a imagem oficial do PHP 8.1 com Apache
FROM php:8.1-apache

# Instala as extensões necessárias (por exemplo, PDO para MySQL)
RUN docker-php-ext-install pdo pdo_mysql

# Copia o conteúdo da pasta "api" (que contém config, models, etc.) para o diretório do Apache
COPY api/ /var/www/html/

# Habilita o mod_rewrite para URLs amigáveis (se necessário)
RUN a2enmod rewrite

# Expondo a porta 80 para o servidor
EXPOSE 80

# Comando para iniciar o Apache em primeiro plano
CMD ["apache2-foreground"]
