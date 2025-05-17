/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { User } from '@/users/entities/user.entity';

// Gender enum for patient
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer-not-to-say',
}

// Marital status enum for patient
export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
}

// Preferred contact method enum
export enum PreferredContact {
  PHONE = 'phone',
  EMAIL = 'email',
  SMS = 'sms',
}

@Entity('patients')
export class Patient {
  push(patient: Patient) {
    throw new Error('Method not implemented.');
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phoneNumber: string;
  @Column()
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.PREFER_NOT_TO_SAY,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    nullable: true,
  })
  maritalStatus: MaritalStatus;

  @Column({ nullable: true })
  alternativePhoneNumber: string;

  @Column({
    type: 'enum',
    enum: PreferredContact,
    nullable: true,
  })
  preferredContact: PreferredContact;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column({ nullable: true })
  profilePhotoUrl: string;

  @ManyToOne(() => User, (user) => user.patients, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'kinesitherapeute_id' })
  kinesitherapeute: User;

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
