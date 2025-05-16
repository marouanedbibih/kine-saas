import { Exclude, Expose, Type } from 'class-transformer';
import { MedicalRecordResponseDto } from '../../medical-record/dto/medical-record-response.dto';
import { InsuranceInfoResponseDto } from '../../insurance-info/dto/insurance-info-response.dto';
import { EmergencyContactResponseDto } from '../../emergency-contact/dto/emergency-contact-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PatientResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  dateOfBirth: Date;

  @ApiProperty()
  @Expose()
  gender: string;

  @ApiProperty()
  @Expose()
  phoneNumber: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  profilePhotoUrl: string;

  @ApiProperty()
  @Expose()
  @Type(() => MedicalRecordResponseDto)
  medicalRecord: MedicalRecordResponseDto;

  @ApiProperty()
  @Expose()
  @Type(() => InsuranceInfoResponseDto)
  insuranceInfo: InsuranceInfoResponseDto;

  @ApiProperty({ type: [EmergencyContactResponseDto] })
  @Expose()
  @Type(() => EmergencyContactResponseDto)
  emergencyContacts: EmergencyContactResponseDto[];

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @Exclude()
  createdByUserId: string;
  constructor(partial: Partial<PatientResponseDto>) {
    Object.assign(this, partial);
  }
}
