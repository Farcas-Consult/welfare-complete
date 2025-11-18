# Admin User Auto-Creation Guide

## How It Works

The backend automatically creates an admin user when it starts **if no admin user exists**.

## Steps to Create Admin

### 1. Make sure your database is running
```bash
# If using Docker Compose
docker compose up -d postgres

# Or ensure your PostgreSQL database is accessible
```

### 2. Start the backend
```bash
cd backend
pnpm install  # If you haven't installed dependencies
pnpm run start:dev
```

### 3. Watch the logs

When the backend starts, you should see one of these messages:

**If admin is created:**
```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     ✅ Admin User Created Successfully! ✅                    ║
║                                                              ║
║     Username: admin                                          ║
║     Email:    admin@welfare.com                              ║
║     Password: Admin@123                                       ║
║                                                              ║
║     ⚠️  Please change the password after first login!        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**If admin already exists:**
```
Admin user already exists. Skipping seed.
```

## Default Admin Credentials

If you don't set environment variables, the default admin is:

- **Username:** `admin`
- **Email:** `admin@welfare.com`
- **Password:** `Admin@123`

## Custom Admin Credentials (Optional)

Create a `.env` file in the `backend` directory:

```env
ADMIN_USERNAME=myadmin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=MySecurePassword123!
```

Then restart the backend.

## Troubleshooting

### Admin not created?

1. **Check database connection:**
   - Ensure PostgreSQL is running
   - Check database credentials in `.env`

2. **Check logs:**
   - Look for error messages in the console
   - The seed service logs errors but doesn't crash the app

3. **Check if admin already exists:**
   - The service skips creation if an admin already exists
   - Check your database: `SELECT * FROM users WHERE role = 'admin';`

4. **Manual creation:**
   - If auto-creation fails, you can manually create an admin via the API:
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "email": "admin@welfare.com",
       "password": "Admin@123"
     }'
   ```
   Then update the role to 'admin' in the database.

## Security Note

⚠️ **IMPORTANT:** Change the default password immediately after first login!

