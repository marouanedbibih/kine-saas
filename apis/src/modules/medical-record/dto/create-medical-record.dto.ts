import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalRecordDto {
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
  diagnosisNotes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  treatmentPlan?: string;
}
