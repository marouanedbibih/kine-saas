import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { Patient } from './entities/patient.entity';
import { Kinesitherapeute } from '../practitioners/entities/kinesitherapeute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Kinesitherapeute])],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
