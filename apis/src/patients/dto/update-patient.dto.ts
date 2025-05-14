import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';

export class UpdatePatientDto {
  @ApiProperty({
    example: 'John',
    description: 'Patient first name',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Patient last name',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: '+212612345678',
    description: 'Patient phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({
    example: '123 Avenue Hassan II, Casablanca',
    description: 'Patient address',
    required: false,
  })
  @IsOptional()
  @IsString()
  adresse?: string;

  @ApiProperty({
    example: '1990-05-15',
    description: 'Patient date of birth (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateNaissance?: string;

  @ApiProperty({
    example: '+212612345679',
    description: 'Emergency contact phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  contactUrgence?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of kinesitherapeute (only for ADMIN)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  kinesitherapeuteId?: string;
}
