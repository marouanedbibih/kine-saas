import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Kinesitherapeute } from '../../kinesitherapeute/entities/kinesitherapeute.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numeroPatient: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  telephone: string;

  @Column({ nullable: true })
  adresse: string;

  @Column({ type: 'date', nullable: true })
  dateNaissance: Date | null;

  @Column({ nullable: true })
  contactUrgence: string;

  @ManyToOne(() => Kinesitherapeute, (kine) => kine.patients, {
    onDelete: 'SET NULL',
  })
  kinesitherapeute: Kinesitherapeute;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
