import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsuranceInfo } from '../insurance-info.entity';
import { CreateInsuranceInfoDto } from '../dto/create-insurance-info.dto';

@Injectable()
export class InsuranceInfoService {
  constructor(
    @InjectRepository(InsuranceInfo)
    private insuranceInfoRepository: Repository<InsuranceInfo>,
  ) {}

  async create(
    createInsuranceInfoDto: CreateInsuranceInfoDto,
    patientId: string,
  ): Promise<InsuranceInfo> {
    const insuranceInfo = this.insuranceInfoRepository.create({
      ...createInsuranceInfoDto,
      patient: { id: patientId },
    });

    return this.insuranceInfoRepository.save(insuranceInfo);
  }

  async findOne(id: string): Promise<InsuranceInfo> {
    const insuranceInfo = await this.insuranceInfoRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!insuranceInfo) {
      throw new NotFoundException(`Insurance info with ID ${id} not found`);
    }

    return insuranceInfo;
  }

  async update(
    id: string,
    updateInsuranceInfoDto: Partial<CreateInsuranceInfoDto>,
  ): Promise<InsuranceInfo> {
    const insuranceInfo = await this.findOne(id);

    Object.assign(insuranceInfo, updateInsuranceInfoDto);

    return this.insuranceInfoRepository.save(insuranceInfo);
  }
}
