import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalInfo } from './medical-info.entity';

/**
 * MedicalInfo Module
 *
 * Handles all medical information operations for patients including
 * storage, retrieval, and management of health records.
 *
 * @author marouanedbibih
 * @created 2025-06-21
 */
@Module({
  imports: [TypeOrmModule.forFeature([MedicalInfo])],
  controllers: [],
})
export class MedicalInfoModule {}
