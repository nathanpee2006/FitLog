#!/bin/bash

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting gunicorn..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3
