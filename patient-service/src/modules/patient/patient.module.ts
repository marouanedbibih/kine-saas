import { Module } from '@nestjs/common';
import { PatientController } from './controllers/patient/patient.controller';
import { PatientService } from './services/patient/patient.service';

@Module({
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule {}
