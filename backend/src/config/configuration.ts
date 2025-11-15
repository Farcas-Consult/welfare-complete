export default () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER || 'welfare_user',
    password: process.env.DATABASE_PASSWORD || 'welfare_pass',
    name: process.env.DATABASE_NAME || 'welfare_db',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'jwt-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'jwt-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  
  minio: {
    endpoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT, 10) || 9000,
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY || 'minio_admin',
    secretKey: process.env.MINIO_SECRET_KEY || 'minio_pass',
    bucketName: process.env.MINIO_BUCKET_NAME || 'welfare-docs',
  },
  
  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    passkey: process.env.MPESA_PASSKEY || '',
    shortcode: process.env.MPESA_SHORTCODE || '174379',
    environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
    callbackUrl: process.env.MPESA_CALLBACK_URL || 'http://localhost:3001/api/payments/mpesa/callback',
  },
  
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    callbackUrl: process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3001/api/payments/paystack/callback',
  },
  
  sms: {
    provider: process.env.SMS_PROVIDER || 'africastalking',
    username: process.env.AFRICASTALKING_USERNAME || '',
    apiKey: process.env.AFRICASTALKING_API_KEY || '',
    senderId: process.env.AFRICASTALKING_SENDER_ID || 'WELFARE',
  },
  
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@welfare.com',
  },
  
  zoom: {
    apiKey: process.env.ZOOM_API_KEY || '',
    apiSecret: process.env.ZOOM_API_SECRET || '',
    webhookSecret: process.env.ZOOM_WEBHOOK_SECRET || '',
  },
  
  cors: {
    origins: process.env.CORS_ORIGINS || 'http://localhost:3000,http://3.6.115.190:3002',
  },
  
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  },
});
