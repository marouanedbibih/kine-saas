import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Patient } from '../patient/patient.entity';

@Entity('emergency_contacts')
export class EmergencyContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  relationship: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  email: string;

  @OneToOne(() => Patient, (patient) => patient.emergencyContact, {
    onDelete: 'CASCADE',
  })
  patient: Patient;
}
