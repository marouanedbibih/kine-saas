// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   OneToOne,
//   JoinColumn,
//   ManyToMany,
//   JoinTable,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Patient } from '../../patients/entities/patient.entity';
// import { Kinesitherapeute } from '../../practitioners/entities/kinesitherapeute.entity';
// import { RendezVous } from '../../appointments/entities/rendezvous.entity';
// import { Exercice } from './exercice.entity';

// @Entity('seances')
// export class Seance {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ type: 'date' })
//   date: Date;

//   @Column()
//   duree: number;

//   @Column({ type: 'text', nullable: true })
//   notesProgression: string;

//   @Column({ type: 'simple-array', nullable: true })
//   photosAvantApres: string[];

//   @ManyToOne(() => Patient)
//   patient: Patient;

//   @ManyToOne(() => Kinesitherapeute)
//   praticien: Kinesitherapeute;

//   @OneToOne(() => RendezVous)
//   @JoinColumn()
//   rendezVous: RendezVous;

//   @ManyToMany(() => Exercice)
//   @JoinTable({
//     name: 'seance_exercices',
//     joinColumn: { name: 'seanceId', referencedColumnName: 'id' },
//     inverseJoinColumn: { name: 'exerciceId', referencedColumnName: 'id' },
//   })
//   exercices: Exercice[];

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
