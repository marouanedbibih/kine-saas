import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMedicalRecordDto } from '../dto/create-medical-record.dto';
import { MedicalRecord } from '../medical-record.entity';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
  ) {}

  async create(
    createMedicalRecordDto: CreateMedicalRecordDto,
    patientId: string,
  ): Promise<MedicalRecord> {
    const medicalRecord = this.medicalRecordRepository.create({
      ...createMedicalRecordDto,
      patient: { id: patientId },
    });

    return this.medicalRecordRepository.save(medicalRecord);
  }

  async findOne(id: string): Promise<MedicalRecord> {
    const medicalRecord = await this.medicalRecordRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!medicalRecord) {
      throw new NotFoundException(`Medical record with ID ${id} not found`);
    }

    return medicalRecord;
  }

  async update(
    id: string,
    updateMedicalRecordDto: Partial<CreateMedicalRecordDto>,
  ): Promise<MedicalRecord> {
    const medicalRecord = await this.findOne(id);

    Object.assign(medicalRecord, updateMedicalRecordDto);

    return this.medicalRecordRepository.save(medicalRecord);
  }
}
