/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/modules/patient/entities/patient.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MedicalRecord } from '../medical-record/medical-record.entity';
import { InsuranceInfo } from '../emergency-contact/insurance-info.entity';
import { EmergencyContact } from '../emergency-contact/emergency-contact.entity';
import { ConsentDocument } from '../documents/consent-document.entity';

@Entity('patients')
export class Patient {
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
  createdByKeycloakId: string; // ID of kinesitherapist who created patient

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
