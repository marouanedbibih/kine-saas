/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  // NotFoundException,
  // ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from '../dto/create-patient.dto';
// import { MedicalRecordService } from '../../medical-record/services/medical-record.service';
// import { InsuranceInfoService } from '../../insurance-info/services/insurance-info.service';
// import { EmergencyContactService } from '../../emergency-contact/services/emergency-contact.service';
import { Patient } from '../patient.entity';
import { User, UserRole } from '@/modules/users/entities/user.entity';
import { EmergencyContact } from '@/modules/emergency-contact/emergency-contact.entity';
import { UpdatePatientDto } from '../dto/update-patient.dto';
@Injectable()
export class PatientService {
  [x: string]: any;
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(EmergencyContact)
    private emergencyContactRepository: Repository<EmergencyContact>,
    // private medicalRecordService: MedicalRecordService,
    // private insuranceInfoService: InsuranceInfoService,
    // private emergencyContactService: EmergencyContactService,
  ) {}

  async create(
    createPatientDto: CreatePatientDto,
    currentUser: User,
  ): Promise<Patient> {
    const { emergencyContact, ...patientData } = createPatientDto;

    let savedEmergencyContact: EmergencyContact | undefined = undefined;
    if (emergencyContact) {
      const emergencyContactEntity = this.emergencyContactRepository.create({
        ...emergencyContact,
      });
      savedEmergencyContact = await this.emergencyContactRepository.save(
        emergencyContactEntity,
      );
    }

    const patient = this.patientRepository.create({
      ...patientData,
      kinesitherapeute: currentUser,
      emergencyContact: savedEmergencyContact,
    });

    const savedPatient = await this.patientRepository.save(patient);

    // Optionally reload with relations
    const patientWithRelations = await this.patientRepository.findOne({
      where: { id: savedPatient.id },
      relations: [
        'medicalRecord',
        'insuranceInfo',
        'emergencyContact',
        'consentDocuments',
        'kinesitherapeute',
      ],
    });
    if (!patientWithRelations) {
      throw new Error('Patient not found after save.');
    }
    return patientWithRelations;
  }

  async findAll(
    currentUser: User,
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ patients: Patient[]; total: number }> {
    const queryBuilder = this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.medicalRecord', 'medicalRecord')
      .leftJoinAndSelect('patient.insuranceInfo', 'insuranceInfo')
      .leftJoinAndSelect('patient.emergencyContact', 'emergencyContact')
      .leftJoinAndSelect('patient.kinesitherapeute', 'kinesitherapeute');

    // Only admins can see all patients, kinesitherapists only see their own
    if (currentUser.role !== UserRole.ADMIN) {
      queryBuilder.where('patient.kinesitherapeute_id = :userId', {
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

  async findOne(id: string, currentUser: User): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: [
        'medicalRecord',
        'insuranceInfo',
        'emergencyContact',
        'consentDocuments',
        'kinesitherapeute',
      ],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    // Allow if admin, or if the current user is the patient's kinesitherapeute
    if (
      currentUser.role !== UserRole.ADMIN &&
      (!patient.kinesitherapeute ||
        patient.kinesitherapeute.id !== currentUser.id)
    ) {
      throw new ForbiddenException(
        `You don't have permission to access this patient`,
      );
    }
    console.log('patient', patient);
    return patient;
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
    currentUser: User,
  ): Promise<Patient> {
    const patient = await this.findOne(id, currentUser);

    // Update main patient fields
    Object.assign(patient, updatePatientDto);

    if (updatePatientDto.emergencyContact) {
      const { emergencyContact, ...rest } = updatePatientDto;
      const emergencyContactEntity =
        await this.emergencyContactRepository.findOne({
          where: { id: emergencyContact.id },
        });

      if (emergencyContactEntity) {
        Object.assign(emergencyContactEntity, emergencyContact);
        await this.emergencyContactRepository.save(emergencyContactEntity);
      } else {
        const newEmergencyContact = this.emergencyContactRepository.create({
          ...emergencyContact,
          patient,
        });
        await this.emergencyContactRepository.save(newEmergencyContact);
      }
    }

    return this.patientRepository.save(patient);
  }

  async updatePhoto(
    id: string,
    photoUrl: string,
    currentUser: User,
  ): Promise<Patient> {
    const patient = await this.findOne(id, currentUser);
    patient.profilePhotoUrl = photoUrl;
    return this.patientRepository.save(patient);
  }

  async remove(id: string, currentUser: User): Promise<void> {
    const patient = await this.findOne(id, currentUser);
    await this.patientRepository.remove(patient);
  }
}
