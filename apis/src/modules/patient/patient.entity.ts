/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/modules/patient/entities/patient.entity.ts
import { ConsentDocument } from '../documents/consent-document.entity';
import { EmergencyContact } from '../emergency-contact/emergency-contact.entity';
import { InsuranceInfo } from '../insurance-info/insurance-info.entity';
import { Kinesitherapeute } from 'src/kinesitherapeute/entities/kinesitherapeute.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MedicalRecord } from '../medical-record/medical-record.entity';

@Entity('patients')
export class Patient {
  push(patient: Patient) {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  gender: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  profilePhotoUrl: string;

  @Column()
  createdByUserId: string; // ID of kinesitherapist who created patient
  @ManyToOne(() => Kinesitherapeute, (kine) => kine.patients)
  @JoinColumn({ name: 'kinesitherapeute_id' })
  kinesitherapeute: Kinesitherapeute;

  @OneToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.patient, {
    cascade: true,
  })
  medicalRecord: MedicalRecord;

  @OneToOne(() => InsuranceInfo, (insuranceInfo) => insuranceInfo.patient, {
    cascade: true,
  })
  insuranceInfo: InsuranceInfo;

  @OneToMany(
    () => EmergencyContact,
    (emergencyContact) => emergencyContact.patient,
    { cascade: true },
  )
  emergencyContacts: EmergencyContact[];

  @OneToMany(
    () => ConsentDocument,
    (consentDocument) => consentDocument.patient,
  )
  consentDocuments: ConsentDocument[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
