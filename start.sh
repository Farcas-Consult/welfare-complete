#!/bin/bash

# Welfare Management System - Complete Setup and Start Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Print colored message
print_message() {
    echo -e "${2}${1}${NC}"
}

# Banner
clear
print_message "╔══════════════════════════════════════════════════════════════╗" "$BLUE"
print_message "║       WELFARE MANAGEMENT SYSTEM - AUTOMATED SETUP           ║" "$BLUE"
print_message "║              FCL Consulting Services Limited                 ║" "$BLUE"
print_message "╚══════════════════════════════════════════════════════════════╝" "$BLUE"
echo ""

# Check prerequisites
print_message "Checking prerequisites..." "$YELLOW"

if ! command -v docker &> /dev/null; then
    print_message "Docker is not installed. Installing..." "$YELLOW"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    if ! docker compose version &> /dev/null; then
        print_message "Installing Docker Compose..." "$YELLOW"
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
fi

print_message "✓ Prerequisites satisfied" "$GREEN"

# Create environment file
if [ ! -f .env ]; then
    print_message "Creating .env file..." "$YELLOW"
    cat > .env << 'EOF'
NODE_ENV=development
DATABASE_NAME=welfare_db
DATABASE_USER=welfare_user
DATABASE_PASSWORD=welfare_pass_2024
REDIS_PASSWORD=redis_pass_2024
JWT_SECRET=jwt_secret_change_this_in_production_2024
MINIO_ROOT_USER=minio_admin
MINIO_ROOT_PASSWORD=minio_pass_2024
MPESA_CONSUMER_KEY=demo_key
MPESA_CONSUMER_SECRET=demo_secret
PAYSTACK_SECRET_KEY=sk_test_demo
REACT_APP_API_URL=http://localhost:3001
EOF
fi

# Create directories
mkdir -p backend/src frontend/src database nginx/ssl uploads backups logs

# Generate SSL certificates
if [ ! -f nginx/ssl/cert.pem ]; then
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/key.pem -out nginx/ssl/cert.pem \
        -subj "/C=KE/ST=Nairobi/L=Nairobi/O=Welfare/CN=localhost" 2>/dev/null
fi

# Start services
print_message "Starting all services..." "$GREEN"
docker-compose up -d

# Wait for services
print_message "Waiting for services to initialize..." "$YELLOW"
sleep 20

# Check services
docker-compose ps

echo ""
print_message "╔══════════════════════════════════════════════════════════════╗" "$GREEN"
print_message "║            DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉            ║" "$GREEN"
print_message "╚══════════════════════════════════════════════════════════════╝" "$GREEN"
echo ""
print_message "Access Points:" "$BLUE"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend API: http://localhost:3001"
echo "  • API Docs: http://localhost:3001/api-docs"
echo "  • MinIO: http://localhost:9001"
echo ""
print_message "Default Login:" "$BLUE"
echo "  • Email: admin@welfare.com"
echo "  • Password: Admin@123"
echo ""
print_message "System is ready! Visit http://localhost:3000" "$GREEN"
