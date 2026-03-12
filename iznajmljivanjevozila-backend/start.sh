#!/bin/bash

# Generate .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate --force
fi

# Run migrations and seed the database
php artisan migrate --force
php artisan db:seed --force

# Start the server
php artisan serve --host=0.0.0.0 --port=8000
