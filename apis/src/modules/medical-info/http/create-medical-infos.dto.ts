import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  BloodType,
  SmokingStatus,
  AlcoholConsumption,
  ExerciseFrequency,
} from '../medical-info.entity';

/**
 * Create Medical Information DTO
 *
 * Data Transfer Object for creating a new medical profile for a patient.
 * Includes all medical information fields with appropriate validation rules.
 *
 * @author marouanedbibih
 * @version 1.0
 * @created 2025-06-21
 */
export class CreateMedicalInfoDto {
  @IsEnum(BloodType, { message: 'Invalid blood type' })
  @IsOptional()
  bloodType?: BloodType;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Height must be a number with at most 2 decimal places' },
  )
  @IsOptional()
  @Min(1, { message: 'Height must be at least 1 cm' })
  @Max(300, { message: 'Height must be at most 300 cm' })
  @Type(() => Number)
  @ValidateIf((object, value) => value !== undefined)
  height?: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Weight must be a number with at most 2 decimal places' },
  )
  @IsOptional()
  @Min(0.1, { message: 'Weight must be at least 0.1 kg' })
  @Max(700, { message: 'Weight must be at most 700 kg' })
  @Type(() => Number)
  @ValidateIf((object, value) => value !== undefined)
  weight?: number;

  @IsString({ message: 'Allergies must be a string' })
  @IsOptional()
  allergies?: string = 'None';

  @IsString({ message: 'Chronic conditions must be a string' })
  @IsOptional()
  chronicConditions?: string = 'None';

  @IsString({ message: 'Current medications must be a string' })
  @IsOptional()
  currentMedications?: string = 'None';

  @IsEnum(SmokingStatus, { message: 'Invalid smoking status' })
  @IsOptional()
  smokingStatus?: SmokingStatus = SmokingStatus.NON_SMOKER;

  @IsEnum(AlcoholConsumption, { message: 'Invalid alcohol consumption level' })
  @IsOptional()
  alcoholConsumption?: AlcoholConsumption = AlcoholConsumption.NONE;

  @IsEnum(ExerciseFrequency, { message: 'Invalid exercise frequency' })
  @IsOptional()
  exerciseFrequency?: ExerciseFrequency = ExerciseFrequency.NEVER;
}
