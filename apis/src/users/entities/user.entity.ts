/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  KINESITHERAPEUTE = 'KINESITHERAPEUTE',
  ASSISTANT = 'ASSISTANT',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
