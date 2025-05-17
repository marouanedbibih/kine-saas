import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => Patient, (patient) => patient.emergencyContacts, {
    onDelete: 'SET NULL',
  })
  patient: Patient;
}
