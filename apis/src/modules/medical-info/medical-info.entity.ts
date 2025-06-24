import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Patient } from '../patient/patient.entity';

/**
 * Enum representing blood types
 */
export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

/**
 * Enum representing smoking status options
 */
export enum SmokingStatus {
  NON_SMOKER = 'Non-smoker',
  OCCASIONAL = 'Occasional',
  REGULAR = 'Regular',
  HEAVY = 'Heavy',
  FORMER = 'Former smoker',
}

/**
 * Enum representing alcohol consumption levels
 */
export enum AlcoholConsumption {
  NONE = 'None',
  OCCASIONAL = 'Occasional',
  MODERATE = 'Moderate',
  FREQUENT = 'Frequent',
  HEAVY = 'Heavy',
}

/**
 * Enum representing exercise frequency
 */
export enum ExerciseFrequency {
  NEVER = 'Never',
  RARELY = 'Rarely',
  ONE_TO_TWO = '1-2 times/week',
  THREE_TO_FIVE = '3-5 times/week',
  DAILY = 'Daily',
}

/**
 * Medical Profile Entity
 *
 * Represents a comprehensive medical profile for patients containing detailed health information,
 * lifestyle factors, and medical history. This entity is linked one-to-one with a Patient entity
 * and stores critical medical data used for treatment planning and health monitoring.
 *
 * @entity medical_profile
 * @author Healthcare System
 * @version 1.0.0
 *
 * Features:
 * - Blood type classification
 * - Physical measurements (height, weight)
 * - Medical history (allergies, chronic conditions, medications)
 * - Lifestyle factors (smoking, alcohol, exercise habits)
 * - Automatic timestamp tracking for record keeping
 * - Cascade deletion with associated patient record
 */
@Entity('medical_infos')
export class MedicalInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: BloodType,
    nullable: true,
  })
  @IsEnum(BloodType)
  @IsOptional()
  bloodType: BloodType;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(300)
  height: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  @Min(0.1)
  @Max(700)
  weight: number;

  @Column({
    type: 'text',
    default: 'None',
  })
  @IsString()
  allergies: string;

  @Column({
    type: 'text',
    default: 'None',
  })
  @IsString()
  chronicConditions: string;

  @Column({
    type: 'text',
    default: 'None',
  })
  @IsString()
  currentMedications: string;

  @Column({
    type: 'enum',
    enum: SmokingStatus,
    default: SmokingStatus.NON_SMOKER,
  })
  @IsEnum(SmokingStatus)
  smokingStatus: SmokingStatus;

  @Column({
    type: 'enum',
    enum: AlcoholConsumption,
    default: AlcoholConsumption.NONE,
  })
  @IsEnum(AlcoholConsumption)
  alcoholConsumption: AlcoholConsumption;

  @Column({
    type: 'enum',
    enum: ExerciseFrequency,
    default: ExerciseFrequency.NEVER,
  })
  @IsEnum(ExerciseFrequency)
  exerciseFrequency: ExerciseFrequency;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Patient, (patient) => patient.medicalInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  patient: Patient;
}
