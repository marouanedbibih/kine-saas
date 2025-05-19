import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePatientDto } from './create-patient.dto';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEmergencyContactDto } from '@/modules/emergency-contact/dto/create-emergency-contact.dto';

export class UpdateEmergencyContactDto extends PartialType(
  CreateEmergencyContactDto,
) {
  @IsOptional()
  @IsString()
  id?: string;
}

// Omit emergencyContact from the base, then redefine it
export class UpdatePatientDto extends OmitType(PartialType(CreatePatientDto), [
  'emergencyContact',
] as const) {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmergencyContactDto)
  emergencyContact?: UpdateEmergencyContactDto;
}
