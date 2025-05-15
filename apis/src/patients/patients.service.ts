import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { Kinesitherapeute } from '../kinesitherapeute/entities/kinesitherapeute.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientsDto } from './dto/query-patients.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Kinesitherapeute)
    private readonly kineRepository: Repository<Kinesitherapeute>,
  ) {}

  async create(
    createPatientDto: CreatePatientDto,
    currentUserId: string,
    currentUserRole: UserRole,
  ): Promise<PatientResponseDto> {
    let kine: Kinesitherapeute | null = null;

    // Find kinesitherapeute based on role
    if (
      currentUserRole === UserRole.ADMIN &&
      createPatientDto.kinesitherapeuteId
    ) {
      // Admin can create patient for any kine
      kine = await this.kineRepository.findOne({
        where: { id: createPatientDto.kinesitherapeuteId },
        relations: ['user'],
      });

      if (!kine) {
        throw new NotFoundException(
          `Kinesitherapeute with ID ${createPatientDto.kinesitherapeuteId} not found`,
        );
      }
    } else if (currentUserRole === UserRole.KINESITHERAPEUTE) {
      // Kine can only create for themselves
      kine = await this.kineRepository.findOne({
        where: { user: { id: currentUserId } },
        relations: ['user'],
      });

      if (!kine) {
        throw new NotFoundException('Kinesitherapeute profile not found');
      }
    } else {
      throw new ForbiddenException(
        'ADMIN must provide kinesitherapeuteId or you must be a KINESITHERAPEUTE',
      );
    }

    // Generate unique patient number
    const numeroPatient = await this.generateUniquePatientNumber();

    // Create new patient
    const patient = this.patientRepository.create({
      numeroPatient,
      firstName: createPatientDto.firstName,
      lastName: createPatientDto.lastName,
      telephone: createPatientDto.telephone,
      adresse: createPatientDto.adresse,
      dateNaissance: createPatientDto.dateNaissance
        ? new Date(createPatientDto.dateNaissance)
        : null,
      contactUrgence: createPatientDto.contactUrgence,
      kinesitherapeute: kine,
    });

    const savedPatient = await this.patientRepository.save(patient);
    return this.mapToResponseDto(savedPatient);
  }

  async findAll(
    queryDto: QueryPatientsDto,
    currentUserId: string,
    currentUserRole: UserRole,
  ) {
    const { page, limit, search, kinesitherapeuteId } = queryDto;
    const skip = (page! - 1) * limit!;

    const query = this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.kinesitherapeute', 'kine')
      .leftJoinAndSelect('kine.user', 'kineUser');

    // Role-based access control
    if (currentUserRole === UserRole.KINESITHERAPEUTE) {
      // Kine can only see their own patients
      const kine = await this.kineRepository.findOne({
        where: { user: { id: currentUserId } },
      });

      if (!kine) {
        throw new NotFoundException('Kinesitherapeute profile not found');
      }

      query.andWhere('kine.id = :kineId', { kineId: kine.id });
    } else if (currentUserRole === UserRole.ADMIN && kinesitherapeuteId) {
      // Admin can filter by kine if provided
      query.andWhere('kine.id = :kineId', { kineId: kinesitherapeuteId });
    }

    // Apply search filter
    if (search) {
      query.andWhere(
        '(patient.firstName ILIKE :search OR patient.lastName ILIKE :search OR ' +
          'patient.telephone ILIKE :search OR patient.numeroPatient ILIKE :search OR ' +
          'patient.adresse ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply pagination
    query.skip(skip).take(limit).orderBy('patient.createdAt', 'DESC');

    // Execute query with count
    const [data, total] = await query.getManyAndCount();

    const patients = data.map((patient) => this.mapToResponseDto(patient));

    return {
      data: patients,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit!),
      },
    };
  }

  async findOne(
    id: string,
    currentUserId: string,
    currentUserRole: UserRole,
  ): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['kinesitherapeute', 'kinesitherapeute.user'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    // Check access permission
    await this.checkAccess(patient, currentUserId, currentUserRole);

    return this.mapToResponseDto(patient);
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
    currentUserId: string,
    currentUserRole: UserRole,
  ): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['kinesitherapeute', 'kinesitherapeute.user'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    // Check access permission
    await this.checkAccess(patient, currentUserId, currentUserRole);

    // Handle kinesitherapeute reassignment (admin only)
    if (
      currentUserRole === UserRole.ADMIN &&
      updatePatientDto.kinesitherapeuteId
    ) {
      const newKine = await this.kineRepository.findOne({
        where: { id: updatePatientDto.kinesitherapeuteId },
      });

      if (!newKine) {
        throw new NotFoundException(
          `Kinesitherapeute with ID ${updatePatientDto.kinesitherapeuteId} not found`,
        );
      }

      patient.kinesitherapeute = newKine;
    }

    // Update patient fields
    Object.assign(patient, {
      firstName: updatePatientDto.firstName ?? patient.firstName,
      lastName: updatePatientDto.lastName ?? patient.lastName,
      telephone: updatePatientDto.telephone ?? patient.telephone,
      adresse: updatePatientDto.adresse ?? patient.adresse,
      dateNaissance: updatePatientDto.dateNaissance
        ? new Date(updatePatientDto.dateNaissance)
        : patient.dateNaissance,
      contactUrgence: updatePatientDto.contactUrgence ?? patient.contactUrgence,
    });

    const updatedPatient = await this.patientRepository.save(patient);
    return this.mapToResponseDto(updatedPatient);
  }

  async remove(
    id: string,
    currentUserId: string,
    currentUserRole: UserRole,
  ): Promise<void> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['kinesitherapeute', 'kinesitherapeute.user'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    // Check access permission
    await this.checkAccess(patient, currentUserId, currentUserRole);

    await this.patientRepository.remove(patient);
  }

  // Helper methods
  private async generateUniquePatientNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.patientRepository.count();
    const number = (count + 1).toString().padStart(4, '0');

    const proposedNumber = `PAT${year}${number}`;

    // Check if this patient number already exists
    const existingPatient = await this.patientRepository.findOne({
      where: { numeroPatient: proposedNumber },
    });

    if (existingPatient) {
      // If exists, try again with incremented count
      return this.generateUniquePatientNumber();
    }

    return proposedNumber;
  }

  private async checkAccess(
    patient: Patient,
    currentUserId: string,
    currentUserRole: UserRole,
  ): Promise<void> {
    // Admin can access all patients
    if (currentUserRole === UserRole.ADMIN) {
      return;
    }

    // Kine can only access their own patients
    if (currentUserRole === UserRole.KINESITHERAPEUTE) {
      const kine = await this.kineRepository.findOne({
        where: { user: { id: currentUserId } },
      });

      if (!kine) {
        throw new NotFoundException('Kinesitherapeute profile not found');
      }

      if (patient.kinesitherapeute?.id !== kine.id) {
        throw new ForbiddenException('You do not have access to this patient');
      }
    } else {
      throw new ForbiddenException('Insufficient permissions');
    }
  }

  private mapToResponseDto(patient: Patient): PatientResponseDto {
    const plainPatient = {
      ...patient,
      kinesitherapeute: patient.kinesitherapeute
        ? {
            id: patient.kinesitherapeute.id,
            licenseNumber: patient.kinesitherapeute.licenseNumber,
            firstName: patient.kinesitherapeute.user?.prenom,
            lastName: patient.kinesitherapeute.user?.nom,
          }
        : null,
    };

    return plainToInstance(PatientResponseDto, plainPatient, {
      excludeExtraneousValues: true,
    });
  }
}
