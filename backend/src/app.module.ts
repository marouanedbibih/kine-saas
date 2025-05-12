/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import databaseConfig from './config/database.config';

// Core modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Guards
import { RolesGuard } from './common/guards/roles.guard';
import { PatientsModule } from './patients/patients.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

// Optional future modules
// import { PatientsModule } from './patients/patients.module';
// import { AppointmentsModule } from './appointments/appointments.module';
// import { SessionsModule } from './sessions/sessions.module';
// import { BillingModule } from './billing/billing.module';
// import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    // Load config with .env support
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // Configure TypeORM dynamically
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');
        if (!dbConfig) {
          throw new Error(
            'Database configuration is missing in config service',
          );
        }
        console.info('✅ Database is connected');
        return dbConfig;
      },
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    PatientsModule,
    // PatientsModule,
    // AppointmentsModule,
    // SessionsModule,
    // BillingModule,
    // AnalyticsModule,
  ],
  providers: [
    // Apply guards globally
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
