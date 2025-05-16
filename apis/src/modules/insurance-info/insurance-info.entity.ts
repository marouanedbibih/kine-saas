/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from '../patient/patient.entity';

@Entity('insurance_info')
export class InsuranceInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Patient, (patient) => patient.insuranceInfo)
  @JoinColumn()
  patient: Patient;

  @Column()
  provider: string;

  @Column()
  policyNumber: string;

  @Column({ nullable: true })
  groupNumber: string;

  @Column()
  primaryInsuredName: string;

  @Column({ nullable: true })
  relationship: string;

  @Column({ nullable: true })
  coverageDetails: string;

  @Column({ nullable: true })
  validUntil: Date;
}
