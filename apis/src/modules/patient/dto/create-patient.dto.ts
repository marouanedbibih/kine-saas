/**
 * Data Transfer Object (DTO) for creating a new patient in the system.
 *
 * This DTO defines the structure and validation rules for incoming patient data.
 * It includes personal information, contact details, demographic data, address information,
 * associated emergency contacts, and a reference to the assigned kinesitherapeute.
 *
 * Uses `class-validator` decorators to enforce validation and `@nestjs/swagger` for API docs.
 *
 * @module Patient
 *
 * @property {string} firstName                - Patient’s first name (required).
 * @property {string} middleName               - Patient’s middle name (optional).
 * @property {string} lastName                 - Patient’s last name (required).
 * @property {string} email                    - Patient’s unique email (required).
 * @property {string} dateOfBirth              - Patient’s birth date in ISO format (required).
 * @property {Gender} gender                   - Patient’s gender: male, female, other, prefer-not-to-say (required).
 * @property {MaritalStatus} maritalStatus     - Patient’s marital status (optional).
 * @property {string} phoneNumber              - Primary contact number (optional but recommended).
 * @property {string} alternativePhoneNumber   - Backup contact number (optional).
 * @property {PreferredContact} preferredContact - Preferred way to contact the patient: phone, email, or SMS (optional).
 * @property {boolean} active                  - Flag indicating if the patient is active in the system (optional).
 * @property {string} address                  - Street address or full address string (optional).
 * @property {string} city                     - City part of address (optional).
 * @property {string} state                    - State or region (optional).
 * @property {string} zipCode                  - Postal/zip code (optional).
 * @property {string} kinesitherapeuteId       - Reference to the kinesitherapeute user assigned to this patient (optional).
 * @property {CreateEmergencyContactDto[]} emergencyContacts - List of emergency contact entries (optional).
 *
 * @class CreatePatientDto
 */

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEmergencyContactDto } from 'src/modules/emergency-contact/dto/create-emergency-contact.dto';

// Enums for validation
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer-not-to-say',
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
}

export enum PreferredContact {
  PHONE = 'phone',
  EMAIL = 'email',
  SMS = 'sms',
}

export class CreatePatientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

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

  @ApiProperty({ enum: Gender, enumName: 'Gender' })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    required: false,
    enum: MaritalStatus,
    enumName: 'MaritalStatus',
  })
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  alternativePhoneNumber?: string;

  @ApiProperty({
    required: false,
    enum: PreferredContact,
    enumName: 'PreferredContact',
  })
  @IsOptional()
  @IsEnum(PreferredContact)
  preferredContact?: PreferredContact;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  // Address fields
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  kinesitherapeuteId?: string;

  @ApiProperty({ type: CreateEmergencyContactDto, required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateEmergencyContactDto)
  emergencyContact?: CreateEmergencyContactDto;
}
