#!/bin/bash

# Generate .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Generate APP_KEY if not set
php artisan key:generate --force --no-interaction

# Create SQLite database file if using sqlite
if grep -q "DB_CONNECTION=sqlite" .env 2>/dev/null || [ -z "$(grep DB_CONNECTION .env 2>/dev/null)" ]; then
    echo "Using SQLite - creating database file..."
    touch database/database.sqlite
fi

# Run migrations and seed the database
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction

# Cache config for performance
php artisan config:cache
php artisan route:cache

# Start the server
php artisan serve --host=0.0.0.0 --port=8000
