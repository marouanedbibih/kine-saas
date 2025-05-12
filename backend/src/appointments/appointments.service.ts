// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository, Between } from 'typeorm';
// import { RendezVous, AppointmentStatus } from './entities/rendezvous.entity';
// import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/create-appointment.dto';

// @Injectable()
// export class AppointmentsService {
//   constructor(
//     @InjectRepository(RendezVous)
//     private appointmentRepository: Repository<RendezVous>,
//   ) {}

//   async create(createAppointmentDto: CreateAppointmentDto) {
//     const appointment = this.appointmentRepository.create(createAppointmentDto);
//     return await this.appointmentRepository.save(appointment);
//   }

//   async findAll(
//     startDate?: string,
//     endDate?: string,
//     praticienId?: string,
//     patientId?: string,
//   ) {
//     const query = this.appointmentRepository.createQueryBuilder('rendezVous')
//       .leftJoinAndSelect('rendezVous.patient', 'patient')
//       .leftJoinAndSelect('patient.user', 'patientUser')
//       .leftJoinAndSelect('rendezVous.praticien', 'praticien')
//       .leftJoinAndSelect('praticien.user', 'praticienUser');

//     if (startDate && endDate) {
//       query.andWhere('rendezVous.dateHeure BETWEEN :startDate AND :endDate', {
//         startDate,
//         endDate,
//       });
//     }

//     if (praticienId) {
//       query.andWhere('praticien.id = :praticienId', { praticienId });
//     }

//     if (patientId) {
//       query.andWhere('patient.id = :patientId', { patientId });
//     }

//     return await query.getMany();
//   }

//   async findOne(id: string) {
//     const appointment = await this.appointmentRepository.findOne({
//       where: { id },
//       relations: ['patient', 'patient.user', 'praticien', 'praticien.user'],
//     });

//     if (!appointment) {
//       throw new NotFoundException(`Appointment with ID ${id} not found`);
//     }

//     return appointment;
//   }

//   async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
//     const appointment = await this.findOne(id);
//     Object.assign(appointment, updateAppointmentDto);
//     return await this.appointmentRepository.save(appointment);
//   }

//   async cancel(id: string) {
//     const appointment = await this.findOne(id);
//     appointment.statut = AppointmentStatus.CANCELLED;
//     return await this.appointmentRepository.save(appointment);
//   }

//   async confirm(id: string) {
//     const appointment = await this.findOne(id);
//     appointment.statut = AppointmentStatus.CONFIRMED;
//     return await this.appointmentRepository.save(appointment);
//   }
// }
