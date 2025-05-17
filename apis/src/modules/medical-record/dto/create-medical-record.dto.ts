import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Blood type enum
export enum BloodType {
  A_POSITIVE = 'a_positive',
  A_NEGATIVE = 'a_negative',
  B_POSITIVE = 'b_positive',
  B_NEGATIVE = 'b_negative',
  AB_POSITIVE = 'ab_positive',
  AB_NEGATIVE = 'ab_negative',
  O_POSITIVE = 'o_positive',
  O_NEGATIVE = 'o_negative',
  UNKNOWN = 'unknown',
}

export class CreateMedicalRecordDto {
  @ApiProperty({ required: false, enum: BloodType, enumName: 'BloodType' })
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  height?: number; // in cm

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  weight?: number; // in kg

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currentMedications?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  previousTreatments?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  chronicConditions?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  diagnosisNotes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  treatmentPlan?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  smokingStatus?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  alcoholConsumption?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  exerciseFrequency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dietaryHabits?: string;
}
