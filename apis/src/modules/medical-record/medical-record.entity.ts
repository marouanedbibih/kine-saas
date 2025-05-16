// src/modules/medical-record/entities/medical-record.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../patient/patient.entity';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Patient, (patient) => patient.medicalRecord)
  @JoinColumn()
  patient: Patient;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ type: 'text', nullable: true })
  currentMedications: string;

  @Column({ type: 'text', nullable: true })
  previousTreatments: string;

  @Column({ type: 'text', nullable: true })
  diagnosisNotes: string;

  @Column({ type: 'text', nullable: true })
  treatmentPlan: string;
}
