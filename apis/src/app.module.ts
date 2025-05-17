/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import databaseConfig from './config/database.config';

// Core modules
import { AuthModule } from './auth/auth.module';

// Guards
import { RolesGuard } from './common/guards/roles.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PatientModule } from './modules/patient/patient.module';
import { EmergencyContactModule } from './modules/emergency-contact/emergency-contact.module';
// import { DocumentsModule } from './modules/documents/documents.module';
import { InsuranceInfoModule } from './modules/insurance-info/insurance-info.module';
import { MedicalRecordModule } from './modules/medical-record/medical-record.module';
import { UsersModule } from './modules/users/users.module';

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
    PatientModule,
    EmergencyContactModule,
    // DocumentsModule,
    InsuranceInfoModule,
    MedicalRecordModule,
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
