FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd pdo_sqlite

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# Install dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Set permissions
RUN chmod -R 777 storage bootstrap/cache

# Expose port 10000
EXPOSE 10000

# Script to run at startup
RUN echo '#!/bin/sh\n\
if [ ! -f .env ]; then\n\
    cp .env.example .env\n\
fi\n\
php artisan key:generate --force\n\
touch database/database.sqlite\n\
php artisan migrate --force\n\
php artisan db:seed --force\n\
php artisan storage:link\n\
php artisan serve --host=0.0.0.0 --port=10000' > /usr/local/bin/start.sh

RUN chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]
