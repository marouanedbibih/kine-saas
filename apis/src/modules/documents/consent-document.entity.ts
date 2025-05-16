/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Patient } from '../patient/patient.entity';

@Entity('consent_documents')
export class ConsentDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  fileType: string;

  @Column()
  filePath: string;

  @Column()
  documentType: string; // e.g., 'treatment_consent', 'privacy_policy'

  @Column({ default: false })
  signed: boolean;

  @Column({ nullable: true })
  signedDate: Date;

  @ManyToOne(() => Patient, (patient) => patient.consentDocuments)
  patient: Patient;

  @CreateDateColumn()
  uploadedAt: Date;
}
