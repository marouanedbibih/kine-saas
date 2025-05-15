import { Module } from '@nestjs/common';
import { MedicalRecordController } from './controllers/medical-record/medical-record.controller';
import { MedicalRecordService } from './services/medical-record/medical-record.service';

@Module({
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService]
})
export class MedicalRecordModule {}
