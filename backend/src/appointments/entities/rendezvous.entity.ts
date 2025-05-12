// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     ManyToOne,
//     OneToOne,
//     CreateDateColumn,
//     UpdateDateColumn,
//   } from 'typeorm';
//   import { Patient } from '../../patients/entities/patient.entity';
//   import { Kinesitherapeute } from '../../practitioners/entities/kinesitherapeute.entity';
//   import { Seance } from '../../sessions/entities/seance.entity';

//   export enum AppointmentStatus {
//     PENDING = 'PENDING',
//     CONFIRMED = 'CONFIRMED',
//     CANCELLED = 'CANCELLED',
//     COMPLETED = 'COMPLETED',
//   }

//   export enum AppointmentType {
//     CONSULTATION = 'CONSULTATION',
//     SEANCE = 'SEANCE',
//     BILAN = 'BILAN',
//   }

//   @Entity('rendezvous')
//   export class RendezVous {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column({ type: 'timestamp' })
//     dateHeure: Date;

//     @Column({ default: 30 })
//     duree: number;

//     @Column({ type: 'enum', enum: AppointmentType })
//     type: AppointmentType;

//     @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
//     statut: AppointmentStatus;

//     @Column({ nullable: true })
//     notes: string;

//     @ManyToOne(() => Patient, (patient) => patient.rendezVous)
//     patient: Patient;

//     @ManyToOne(() => Kinesitherapeute, (kine) => kine.agenda)
//     praticien: Kinesitherapeute;

//     @OneToOne(() => Seance, (seance) => seance.rendezVous)
//     seance: Seance;

//     @CreateDateColumn()
//     createdAt: Date;

//     @UpdateDateColumn()
//     updatedAt: Date;
//   }
