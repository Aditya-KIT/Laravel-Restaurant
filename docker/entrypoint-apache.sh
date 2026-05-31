#!/bin/sh
set -e

# ----------------------------------------------------------------
# Render passes a dynamic PORT environment variable.
# Apache must listen on that port instead of the default 80.
# ----------------------------------------------------------------
LISTEN_PORT="${PORT:-80}"

if [ "$LISTEN_PORT" != "80" ]; then
    echo "Configuring Apache to listen on port $LISTEN_PORT (Render PORT)..."
    sed -i "s/Listen 80/Listen $LISTEN_PORT/" /etc/apache2/ports.conf
    sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$LISTEN_PORT>/" /etc/apache2/sites-available/000-default.conf
fi

# ----------------------------------------------------------------
# Generate .env file from environment variables if it doesn't exist
# ----------------------------------------------------------------
if [ ! -f /var/www/html/.env ]; then
    echo "No .env file found — copying from .env.example..."
    cp /var/www/html/.env.example /var/www/html/.env

    # Apply key environment variables to .env
    if [ -n "$APP_KEY" ]; then
        sed -i "s|^APP_KEY=.*|APP_KEY=$APP_KEY|" /var/www/html/.env
    fi
    if [ -n "$APP_URL" ]; then
        sed -i "s|^APP_URL=.*|APP_URL=$APP_URL|" /var/www/html/.env
    fi
    if [ -n "$DB_CONNECTION" ]; then
        sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=$DB_CONNECTION|" /var/www/html/.env
    fi
    if [ -n "$DB_HOST" ]; then
        sed -i "s|^DB_HOST=.*|DB_HOST=$DB_HOST|" /var/www/html/.env
    fi
    if [ -n "$DB_PORT" ]; then
        sed -i "s|^DB_PORT=.*|DB_PORT=$DB_PORT|" /var/www/html/.env
    fi
    if [ -n "$DB_DATABASE" ]; then
        sed -i "s|^DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|" /var/www/html/.env
    fi
    if [ -n "$DB_USERNAME" ]; then
        sed -i "s|^DB_USERNAME=.*|DB_USERNAME=$DB_USERNAME|" /var/www/html/.env
    fi
    if [ -n "$DB_PASSWORD" ]; then
        sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" /var/www/html/.env
    fi
fi

# ----------------------------------------------------------------
# Ensure storage directories exist with correct permissions
# ----------------------------------------------------------------
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# ----------------------------------------------------------------
# Generate application key if not set
# ----------------------------------------------------------------
if [ -z "$APP_KEY" ] || grep -q "^APP_KEY=$" /var/www/html/.env; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# ----------------------------------------------------------------
# Clear stale caches from build time
# ----------------------------------------------------------------
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

# ----------------------------------------------------------------
# Run database migrations
# ----------------------------------------------------------------
if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force

    if [ "${SEED_DATABASE:-false}" = "true" ]; then
        echo "Seeding database..."
        php artisan db:seed --force
    fi
fi

# ----------------------------------------------------------------
# Cache config/routes/views for production performance
# ----------------------------------------------------------------
echo "Caching Laravel configuration for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# ----------------------------------------------------------------
# Start Apache in foreground
# ----------------------------------------------------------------
echo "Starting Apache on port $LISTEN_PORT..."
exec apache2-foreground
