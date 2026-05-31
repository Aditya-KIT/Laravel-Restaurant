#!/bin/sh
set -e

# Wait for database connection if DB_HOST is set
if [ -n "$DB_HOST" ]; then
    echo "Waiting for database connection on $DB_HOST:${DB_PORT:-3306}..."
    until php -r "
        try {
            \$pdo = new PDO(
                'mysql:host=' . getenv('DB_HOST') . ';port=' . (getenv('DB_PORT') ?: 3306),
                getenv('DB_DATABASE'),
                getenv('DB_USERNAME'),
                getenv('DB_PASSWORD'),
                [PDO::ATTR_TIMEOUT => 2]
            );
            exit(0);
        } catch (Exception \$e) {
            exit(1);
        }
    "; do
        echo "Database is unavailable - sleeping..."
        sleep 2
    done
    echo "Database is up and running!"
fi

# Ensure storage and bootstrap/cache permissions are correct at runtime
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Clear existing cache
php artisan config:clear
php artisan cache:clear

# Run database migrations in production/staging environments
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force
    
    # Optionally seed database if requested
    if [ "${SEED_DATABASE:-false}" = "true" ]; then
        echo "Seeding database..."
        php artisan db:seed --force
    fi
fi

# Cache config, routes, and views for production performance
echo "Caching Laravel configuration, routes, and views for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Execute the primary container command (default to starting php-fpm)
if [ $# -eq 0 ]; then
    echo "Starting PHP-FPM backend server..."
    exec php-fpm
else
    echo "Executing custom command: $@"
    exec "$@"
fi
