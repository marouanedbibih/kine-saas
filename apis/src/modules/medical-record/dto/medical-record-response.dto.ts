import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MedicalRecordResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ required: false })
  @Expose()
  medicalHistory?: string;

  @ApiProperty({ required: false })
  @Expose()
  allergies?: string;

  @ApiProperty({ required: false })
  @Expose()
  currentMedications?: string;

  @ApiProperty({ required: false })
  @Expose()
  previousTreatments?: string;

  @ApiProperty({ required: false })
  @Expose()
  diagnosisNotes?: string;

  @ApiProperty({ required: false })
  @Expose()
  treatmentPlan?: string;
}
