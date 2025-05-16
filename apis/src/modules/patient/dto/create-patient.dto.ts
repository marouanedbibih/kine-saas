import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMedicalRecordDto } from 'src/modules/medical-record/dto/create-medical-record.dto';
import { CreateInsuranceInfoDto } from 'src/modules/insurance-info/dto/create-insurance-info.dto';
import { CreateEmergencyContactDto } from 'src/modules/emergency-contact/dto/create-emergency-contact.dto';

export class CreatePatientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMedicalRecordDto)
  medicalRecord?: CreateMedicalRecordDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateInsuranceInfoDto)
  insuranceInfo?: CreateInsuranceInfoDto;

  @ApiProperty({ type: [CreateEmergencyContactDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEmergencyContactDto)
  emergencyContacts?: CreateEmergencyContactDto[];
}
