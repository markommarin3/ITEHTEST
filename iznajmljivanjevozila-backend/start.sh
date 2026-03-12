#!/bin/bash

# Generate .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
fi

# Generate APP_KEY if not set
php artisan key:generate --force --no-interaction

# Force DB_CONNECTION to sqlite to override any Render environment variables
export DB_CONNECTION=sqlite

echo "Using SQLite - creating database file..."
mkdir -p database
touch database/database.sqlite


# Run migrations and seed the database
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction

# Cache config for performance
php artisan config:cache
php artisan route:cache

# Start the server
php artisan serve --host=0.0.0.0 --port=8000
