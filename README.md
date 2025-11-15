# Welfare Management System

[![CI](https://github.com/yourusername/welfare-complete/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/welfare-complete/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

A comprehensive welfare management system built with NestJS (Backend) and React (Frontend).

## Features

- **Member Management**: Register and manage members with dependents
- **Contributions**: Track monthly contributions and invoices
- **Claims Processing**: Submit, review, and approve claims
- **Loan Management**: Apply for loans, track repayments, and manage guarantors
- **Payments**: Process payments via multiple channels (M-Pesa, Paystack)
- **Meetings**: Schedule and manage meetings
- **Notifications**: In-app, email, and SMS notifications
- **Reports**: Generate various reports and analytics
- **Audit Logging**: Track all system activities
- **File Storage**: Store documents using MinIO

## Prerequisites

Before installing, ensure you have the following installed on your system:

### Required Software
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 8.0.0 (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### For Docker Installation (Recommended)
- **Docker** >= 20.10 ([Download](https://www.docker.com/get-started))
- **Docker Compose** >= 2.0 (included with Docker Desktop)

### For Manual Installation
- **PostgreSQL** >= 15 ([Download](https://www.postgresql.org/download/))
- **Redis** >= 7 ([Download](https://redis.io/download))

### Verify Prerequisites
```bash
# Check Node.js version
node --version  # Should be >= 18.0.0

# Check npm version
npm --version   # Should be >= 8.0.0

# Check Docker (if using Docker)
docker --version
docker-compose --version

# Check PostgreSQL (if installing manually)
psql --version

# Check Redis (if installing manually)
redis-cli --version
```

## Installation

### Option 1: Docker Installation (Recommended)

This is the easiest and fastest way to get started. Docker will handle all dependencies automatically.

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd welfare-complete
```

#### Step 2: Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your preferred editor
# For basic setup, you can use the default values
# For production, update all secrets and credentials
```

**Important Environment Variables to Configure:**
```env
# Security - Change these in production!
JWT_SECRET=your_strong_jwt_secret_here
JWT_REFRESH_SECRET=your_strong_refresh_secret_here
DATABASE_PASSWORD=your_secure_database_password
REDIS_PASSWORD=your_secure_redis_password

# Payment Gateways (Optional for development)
MPESA_CONSUMER_KEY=your_mpesa_key
MPESA_CONSUMER_SECRET=your_mpesa_secret
PAYSTACK_SECRET_KEY=your_paystack_key

# Email Configuration (Optional for development)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

#### Step 3: Start All Services
```bash
# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

#### Step 4: Wait for Services to Initialize
Wait approximately 30-60 seconds for all services to start. You can monitor the logs:
```bash
# Watch backend logs
docker-compose logs -f backend

# Watch database initialization
docker-compose logs -f postgres
```

#### Step 5: Verify Installation
```bash
# Check backend health
curl http://localhost:3001/health

# Check if database is ready
docker-compose exec postgres pg_isready -U welfare_user

# Check Redis
docker-compose exec redis redis-cli -a redis_pass_2024 ping
```

#### Step 6: Run Database Migrations (if needed)
```bash
# Access backend container
docker-compose exec backend sh

# Inside the container, run migrations
npm run migration:run

# Optional: Seed the database
npm run seed

# Exit container
exit
```

#### Step 7: Access the Application
Once all services are running, access:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/v1
- **API Documentation (Swagger)**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/health
- **MinIO Console**: http://localhost:9001 (Login: minio_admin / minio_pass_2024)
- **Adminer (Database UI)**: http://localhost:8080
  - System: PostgreSQL
  - Server: postgres
  - Username: welfare_user
  - Password: welfare_pass_2024
  - Database: welfare_db

#### Docker Commands Reference
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# View logs
docker-compose logs -f [service-name]

# Restart a specific service
docker-compose restart backend

# Execute commands in a container
docker-compose exec backend npm run migration:run
docker-compose exec postgres psql -U welfare_user -d welfare_db

# Rebuild containers after code changes
docker-compose up -d --build
```

### Option 2: Manual Installation

Use this method if you prefer to run services individually or don't want to use Docker.

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd welfare-complete
```

#### Step 2: Install and Configure PostgreSQL

**On macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**On Windows:**
Download and install from [PostgreSQL website](https://www.postgresql.org/download/windows/)

**Create Database:**
```bash
# Access PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE welfare_db;
CREATE USER welfare_user WITH PASSWORD 'welfare_pass_2024';
GRANT ALL PRIVILEGES ON DATABASE welfare_db TO welfare_user;
\q
```

#### Step 3: Install and Configure Redis

**On macOS (using Homebrew):**
```bash
brew install redis
brew services start redis
```

**On Ubuntu/Debian:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**On Windows:**
Download from [Redis website](https://redis.io/download) or use WSL

**Configure Redis Password (Optional but Recommended):**
```bash
# Edit redis.conf
sudo nano /etc/redis/redis.conf
# Add: requirepass redis_pass_2024
sudo systemctl restart redis-server
```

#### Step 4: Install and Configure MinIO (Optional)

**On macOS:**
```bash
brew install minio/stable/minio
minio server /data --console-address ":9001"
```

**On Linux:**
```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
./minio server /data --console-address ":9001"
```

**Or use Docker for MinIO only:**
```bash
docker run -d -p 9000:9000 -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minio_admin" \
  -e "MINIO_ROOT_PASSWORD=minio_pass_2024" \
  minio/minio server /data --console-address ":9001"
```

#### Step 5: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp ../.env.example ../.env
# Edit ../.env with your database and service credentials

# Run database migrations
npm run migration:run

# Seed database with initial data (optional)
npm run seed

# Start development server
npm run start:dev
```

**Backend should now be running at:** http://localhost:3001

**Verify backend is working:**
```bash
# In another terminal
curl http://localhost:3001/health
# Should return: {"status":"ok",...}
```

#### Step 6: Frontend Setup

```bash
# Open a new terminal
cd frontend

# Install dependencies
npm install

# Create environment file
cat > .env << EOF
REACT_APP_API_URL=http://localhost:3001
REACT_APP_MINIO_URL=http://localhost:9000
REACT_APP_ENVIRONMENT=development
EOF

# Start development server
npm start
```

**Frontend should automatically open at:** http://localhost:3000

#### Step 7: Verify Complete Installation

1. **Check Backend Health:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Check API Documentation:**
   Open browser: http://localhost:3001/api-docs

3. **Check Frontend:**
   Open browser: http://localhost:3000

4. **Test Database Connection:**
   ```bash
   psql -U welfare_user -d welfare_db -c "SELECT version();"
   ```

5. **Test Redis Connection:**
   ```bash
   redis-cli -a redis_pass_2024 ping
   # Should return: PONG
   ```

#### Troubleshooting Manual Installation

**Backend won't start:**
- Check if PostgreSQL is running: `pg_isready`
- Verify database credentials in `.env`
- Check if port 3001 is available: `lsof -i :3001`

**Database connection errors:**
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Check database exists: `psql -U postgres -l | grep welfare_db`
- Verify user permissions: `psql -U postgres -c "\du"`

**Redis connection errors:**
- Check if Redis is running: `redis-cli ping`
- Verify password matches in `.env`
- Check Redis logs: `sudo journalctl -u redis-server`

**Frontend won't connect to backend:**
- Verify `REACT_APP_API_URL` in frontend `.env`
- Check backend is running on correct port
- Verify CORS settings in backend configuration

## Project Structure

```
welfare-complete/
├── backend/
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── members/      # Member management
│   │   │   ├── contributions/# Contributions
│   │   │   ├── claims/       # Claims processing
│   │   │   ├── loans/         # Loan management
│   │   │   ├── payments/     # Payment processing
│   │   │   ├── meetings/     # Meeting management
│   │   │   ├── notifications/# Notifications
│   │   │   ├── reports/      # Reports
│   │   │   ├── audit/        # Audit logging
│   │   │   ├── health/       # Health checks
│   │   │   └── storage/      # File storage
│   │   ├── common/           # Shared utilities
│   │   ├── config/           # Configuration
│   │   └── database/         # Database setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── store/            # Redux store
│   └── package.json
├── database/
│   ├── init.sql              # Database initialization
│   └── seed.sql              # Seed data
├── docker-compose.yml         # Docker configuration
└── .env.example              # Environment variables template
```

## API Documentation

Once the backend is running, access Swagger documentation at:
- http://localhost:3001/api-docs

## Environment Variables

See `.env.example` for all available environment variables. Key variables include:

- Database connection settings
- JWT secrets
- Payment gateway credentials (M-Pesa, Paystack)
- Email and SMS configuration
- MinIO storage settings

## Development

### Backend Commands

```bash
npm run start:dev      # Start in development mode
npm run build          # Build for production
npm run start:prod     # Start production server
npm run test           # Run tests
npm run lint           # Lint code
npm run format         # Format code
```

### Frontend Commands

```bash
npm start              # Start development server
npm run build          # Build for production
npm test               # Run tests
npm run lint           # Lint code
npm run format         # Format code
```

## Database Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:cov      # With coverage

# Frontend tests
cd frontend
npm test
```

## Production Deployment

1. **Build the applications**
   ```bash
   # Backend
   cd backend
   npm run build

   # Frontend
   cd frontend
   npm run build
   ```

2. **Set production environment variables**

3. **Use Docker Compose with production profile**
   ```bash
   docker-compose --profile production up -d
   ```

## Post-Installation Setup

### Initial Configuration

1. **Create Admin User** (if not seeded)
   - Register through the frontend at http://localhost:3000/register
   - Or use the API to create an admin user

2. **Configure Payment Gateways** (Optional)
   - Add M-Pesa credentials in `.env` for M-Pesa payments
   - Add Paystack credentials for Paystack payments

3. **Set Up Email Service** (Optional)
   - Configure SMTP settings in `.env`
   - For development, you can use Mailhog (included in Docker)

4. **Configure SMS Service** (Optional)
   - Add Africa's Talking credentials in `.env`
   - Or configure your preferred SMS provider

### First Login

1. Open http://localhost:3000
2. Click "Register" to create your first account
3. Or use seeded admin credentials (if database was seeded)
4. Complete your profile setup

## Troubleshooting

### Common Issues

#### Database Connection Issues

**Symptoms:** Backend fails to start, "ECONNREFUSED" errors

**Solutions:**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres  # For Docker
sudo systemctl status postgresql  # For manual

# Verify database credentials
docker-compose exec postgres psql -U welfare_user -d welfare_db -c "SELECT 1;"

# Check connection from backend
docker-compose exec backend sh
npm run migration:run
```

**Fix:**
- Verify `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD` in `.env`
- Ensure database exists: `CREATE DATABASE welfare_db;`
- Check user permissions

#### Redis Connection Issues

**Symptoms:** Queue jobs fail, caching doesn't work

**Solutions:**
```bash
# Test Redis connection
docker-compose exec redis redis-cli -a redis_pass_2024 ping

# Check Redis logs
docker-compose logs redis

# Restart Redis
docker-compose restart redis
```

**Fix:**
- Verify `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` in `.env`
- Ensure Redis password matches in configuration

#### Port Conflicts

**Symptoms:** "Port already in use" errors

**Solutions:**
```bash
# Find what's using the port
lsof -i :3001  # For backend
lsof -i :3000  # For frontend
lsof -i :5432  # For PostgreSQL

# Kill the process or change ports in .env
```

**Fix:**
- Change ports in `.env`:
  ```env
  PORT=3002
  FRONTEND_PORT=3001
  DATABASE_PORT=5433
  ```
- Update `docker-compose.yml` if using Docker
- Restart services

#### Frontend Can't Connect to Backend

**Symptoms:** API calls fail, CORS errors

**Solutions:**
```bash
# Verify backend is running
curl http://localhost:3001/health

# Check frontend .env
cat frontend/.env
# Should have: REACT_APP_API_URL=http://localhost:3001

# Check CORS settings in backend
# Should allow: http://localhost:3000
```

**Fix:**
- Ensure `REACT_APP_API_URL` in frontend `.env` matches backend URL
- Verify CORS_ORIGINS in backend `.env` includes frontend URL
- Check browser console for specific errors

#### Migration Errors

**Symptoms:** "Table already exists" or migration failures

**Solutions:**
```bash
# Check migration status
docker-compose exec backend npm run migration:run

# Revert and re-run
docker-compose exec backend npm run migration:revert
docker-compose exec backend npm run migration:run

# For fresh start (⚠️ deletes data)
docker-compose down -v
docker-compose up -d
```

#### Docker Container Issues

**Symptoms:** Containers won't start or keep restarting

**Solutions:**
```bash
# View container logs
docker-compose logs [service-name]

# Check container status
docker-compose ps

# Rebuild containers
docker-compose up -d --build

# Remove and recreate
docker-compose down
docker-compose up -d
```

#### Module Not Found Errors

**Symptoms:** "Cannot find module" errors

**Solutions:**
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules package-lock.json && npm install
cd ../frontend && rm -rf node_modules package-lock.json && npm install

# Clear npm cache
npm cache clean --force
```

### Getting Help

If you encounter issues not covered here:

1. **Check Logs:**
   ```bash
   # Docker logs
   docker-compose logs -f
   
   # Backend logs
   cd backend && npm run start:dev
   
   # Frontend logs
   cd frontend && npm start
   ```

2. **Verify Installation:**
   - Review `INSTALLATION_CHECKLIST.md`
   - Check all prerequisites are met
   - Verify environment variables are set correctly

3. **Common Solutions:**
   - Restart all services
   - Clear node_modules and reinstall
   - Check firewall settings
   - Verify network connectivity

4. **Report Issues:**
   - Open an issue on GitHub
   - Include error messages and logs
   - Specify your OS and installation method

## License

[Your License Here]

## Support

For issues and questions, please open an issue in the repository.

