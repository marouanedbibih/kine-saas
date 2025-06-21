import { Module } from '@nestjs/common';
import { PatientController } from './controllers/patient.controller';
import { PatientService } from './services/patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { EmergencyContact } from '../emergency-contact/emergency-contact.entity';
import { MedicalInfoModule } from '../medical-info/medical-info.module';
import { MedicalInfo } from '../medical-info/medical-info.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, User, EmergencyContact, MedicalInfo]),
    UsersModule,
    MedicalInfoModule,
  ],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
