import { Module } from '@nestjs/common';
import { PatientController } from './controllers/patient.controller';
import { PatientService } from './services/patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { EmergencyContact } from '../emergency-contact/emergency-contact.entity';
// import { MedicalRecordModule } from '../medical-record/medical-record.module';
// import { InsuranceInfoModule } from '../insurance-info/insurance-info.module';
// import { EmergencyContactModule } from '../emergency-contact/emergency-contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, User, EmergencyContact]),
    UsersModule,
    // MedicalRecordModule,
    // InsuranceInfoModule,
    // EmergencyContactModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
