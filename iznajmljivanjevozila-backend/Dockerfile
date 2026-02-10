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
    libsqlite3-dev \
    nginx

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
RUN chmod -R 777 storage bootstrap/cache database

# Script to run at startup
RUN echo '#!/bin/sh\n\
    if [ ! -f .env ]; then\n\
    cp .env.example .env\n\
    fi\n\
    php artisan key:generate --force\n\
    touch database/database.sqlite\n\
    chmod 777 database/database.sqlite\n\
    php artisan migrate --force --seed\n\
    php artisan storage:link\n\
    # Use the PORT environment variable if available, fallback to 10000\n\
    PORT=${PORT:-10000}\n\
    echo "Starting Laravel on port $PORT..."\n\
    php artisan serve --host=0.0.0.0 --port=$PORT' > /usr/local/bin/start.sh

RUN chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]
