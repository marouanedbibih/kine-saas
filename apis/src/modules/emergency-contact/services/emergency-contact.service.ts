import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmergencyContact } from '../emergency-contact.entity';
import { CreateEmergencyContactDto } from '../dto/create-emergency-contact.dto';

@Injectable()
export class EmergencyContactService {
  constructor(
    @InjectRepository(EmergencyContact)
    private emergencyContactRepository: Repository<EmergencyContact>,
  ) {}

  async create(
    createEmergencyContactDto: CreateEmergencyContactDto,
    patientId: string,
  ): Promise<EmergencyContact> {
    const emergencyContact = this.emergencyContactRepository.create({
      ...createEmergencyContactDto,
      patient: { id: patientId },
    });

    return this.emergencyContactRepository.save(emergencyContact);
  }

  async createMany(
    createEmergencyContactDtos: CreateEmergencyContactDto[],
    patientId: string,
  ): Promise<EmergencyContact[]> {
    const emergencyContacts = createEmergencyContactDtos.map((dto) =>
      this.emergencyContactRepository.create({
        ...dto,
        patient: { id: patientId },
      }),
    );

    return this.emergencyContactRepository.save(emergencyContacts);
  }

  async findAll(patientId: string): Promise<EmergencyContact[]> {
    return this.emergencyContactRepository.find({
      where: { patient: { id: patientId } },
    });
  }

  async findOne(id: string): Promise<EmergencyContact> {
    const emergencyContact = await this.emergencyContactRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!emergencyContact) {
      throw new NotFoundException(`Emergency contact with ID ${id} not found`);
    }

    return emergencyContact;
  }

  async update(
    id: string,
    updateEmergencyContactDto: Partial<CreateEmergencyContactDto>,
  ): Promise<EmergencyContact> {
    const emergencyContact = await this.findOne(id);

    Object.assign(emergencyContact, updateEmergencyContactDto);

    return this.emergencyContactRepository.save(emergencyContact);
  }

  async remove(id: string): Promise<void> {
    const emergencyContact = await this.findOne(id);
    await this.emergencyContactRepository.remove(emergencyContact);
  }
}
