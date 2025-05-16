import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Patient } from '../../modules/patient/patient.entity';

@Entity('kinesitherapeutes')
export class Kinesitherapeute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  licenseNumber: string;

  @Column({ nullable: true })
  specialisation: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;

  @OneToMany(() => Patient, (patient) => patient.kinesitherapeute)
  patients: Patient[];
}
