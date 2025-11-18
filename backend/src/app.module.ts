import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { MembersModule } from './modules/members/members.module';
import { ContributionsModule } from './modules/contributions/contributions.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { LoansModule } from './modules/loans/loans.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './modules/health/health.module';
import { StorageModule } from './modules/storage/storage.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

// Configuration
import configuration from './config/configuration';

// Database Seed
import { SeedService } from './database/seed.service';
import { User } from './modules/auth/entities/user.entity';

@Module({
  imports: [
    // Database entities for seeding
    TypeOrmModule.forFeature([User]),
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.production', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        autoLoadEntities: true,
        retryAttempts: 3,
        retryDelay: 3000,
        extra: {
          max: 100,
          connectionTimeoutMillis: 2000,
        },
      }),
    }),

    // Redis Queue
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        },
      }),
    }),

    // Rate Limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get('RATE_LIMIT_TTL') || 60,
            limit: configService.get('RATE_LIMIT_MAX') || 100,
          },
        ],
      }),
    }),

    // Scheduling
    ScheduleModule.forRoot(),

    // Static Files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),

    // Feature Modules
    AuthModule,
    MembersModule,
    ContributionsModule,
    ClaimsModule,
    LoansModule,
    MeetingsModule,
    PaymentsModule,
    NotificationsModule,
    ReportsModule,
    AuditModule,
    HealthModule,
    StorageModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [SeedService],
})
export class AppModule {}
