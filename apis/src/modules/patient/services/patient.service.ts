import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { UserDto } from '../../../common/interfaces/user.interface';
import { UserRole } from '../../../common/interfaces/user-role.enum';
import { MedicalRecordService } from '../../medical-record/services/medical-record.service';
import { InsuranceInfoService } from '../../insurance-info/services/insurance-info.service';
import { EmergencyContactService } from '../../emergency-contact/services/emergency-contact.service';
import { Patient } from '../patient.entity';
@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private medicalRecordService: MedicalRecordService,
    private insuranceInfoService: InsuranceInfoService,
    private emergencyContactService: EmergencyContactService,
  ) {}

  async create(
    createPatientDto: CreatePatientDto,
    currentUser: UserDto,
  ): Promise<Patient> {
    const patient = this.patientRepository.create({
      ...createPatientDto,
      createdByUserId: currentUser.id,
    });

    return this.patientRepository.save(patient);
  }

  async findAll(
    currentUser: UserDto,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ patients: Patient[]; total: number }> {
    const queryBuilder = this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.medicalRecord', 'medicalRecord')
      .leftJoinAndSelect('patient.insuranceInfo', 'insuranceInfo')
      .leftJoinAndSelect('patient.emergencyContacts', 'emergencyContacts');

    // Only admins can see all patients, kinesitherapists only see their own
    if (currentUser.role !== UserRole.ADMIN) {
      queryBuilder.where('patient.createdByUserId = :userId', {
        userId: currentUser.id,
      });
    }

    // Add search functionality
    if (search) {
      queryBuilder.andWhere(
        '(patient.firstName ILIKE :search OR patient.lastName ILIKE :search OR patient.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Add pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [patients, total] = await queryBuilder.getManyAndCount();

    return { patients, total };
  }

  async findOne(id: string, currentUser: UserDto): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: [
        'medicalRecord',
        'insuranceInfo',
        'emergencyContacts',
        'consentDocuments',
      ],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    // Check if user has access to this patient
    if (
      currentUser.role !== UserRole.ADMIN &&
      patient.createdByUserId !== currentUser.id
    ) {
      throw new ForbiddenException(
        `You don't have permission to access this patient`,
      );
    }

    return patient;
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
    currentUser: UserDto,
  ): Promise<Patient> {
    const patient = await this.findOne(id, currentUser);

    // Update main patient fields
    Object.assign(patient, updatePatientDto);

    // Handle nested entities updates separately if needed
    if (updatePatientDto.medicalRecord) {
      await this.medicalRecordService.update(
        patient.medicalRecord.id,
        updatePatientDto.medicalRecord,
      );
    }

    if (updatePatientDto.insuranceInfo) {
      await this.insuranceInfoService.update(
        patient.insuranceInfo.id,
        updatePatientDto.insuranceInfo,
      );
    }

    if (updatePatientDto.emergencyContacts) {
      // Handle emergency contacts updates...
      // This would typically involve more complex logic to add/update/remove contacts
    }

    return this.patientRepository.save(patient);
  }

  async updatePhoto(
    id: string,
    photoUrl: string,
    currentUser: UserDto,
  ): Promise<Patient> {
    const patient = await this.findOne(id, currentUser);
    patient.profilePhotoUrl = photoUrl;
    return this.patientRepository.save(patient);
  }

  async remove(id: string, currentUser: UserDto): Promise<void> {
    const patient = await this.findOne(id, currentUser);
    await this.patientRepository.remove(patient);
  }
}
