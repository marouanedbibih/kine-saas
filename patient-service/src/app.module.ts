import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './modules/patient/patient.module';
import { MedicalRecordModule } from './modules/medical-record/medical-record.module';
import { InsuranceInfoModule } from './modules/insurance-info/insurance-info.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { EmergencyContactModule } from './modules/emergency-contact/emergency-contact.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [PatientModule, MedicalRecordModule, InsuranceInfoModule, DocumentsModule, EmergencyContactModule, AuthModule, ConfigModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
