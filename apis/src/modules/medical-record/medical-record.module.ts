import { Module } from '@nestjs/common';
import { MedicalRecordController } from './controllers/medical-record.controller';
import { MedicalRecordService } from './services/medical-record.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './medical-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord])],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService], // Export the service so it can be used in other modules
})
export class MedicalRecordModule {}
