// import { IsUUID, IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
// import { AppointmentType } from '../entities/rendezvous.entity';

// export class CreateAppointmentDto {
//   @IsUUID()
//   patientId: string;

//   @IsUUID()
//   praticienId: string;

//   @IsDateString()
//   dateHeure: string;

//   @IsNumber()
//   @IsOptional()
//   duree?: number;

//   @IsEnum(AppointmentType)
//   type: AppointmentType;

//   @IsOptional()
//   notes?: string;
// }

// export class UpdateAppointmentDto {
//   @IsOptional()
//   @IsDateString()
//   dateHeure?: string;

//   @IsOptional()
//   @IsNumber()
//   duree?: number;

//   @IsOptional()
//   notes?: string;
// }
