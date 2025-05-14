// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ManyToOne,
//   OneToMany,
//   ManyToMany,
//   JoinTable,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';
// import { Patient } from '../../patients/entities/patient.entity';
// import { Seance } from '../../sessions/entities/seance.entity';
// import { Paiement } from './paiement.entity';

// export enum InvoiceStatus {
//   DRAFT = 'DRAFT',
//   SENT = 'SENT',
//   PAID = 'PAID',
//   OVERDUE = 'OVERDUE',
//   CANCELLED = 'CANCELLED',
// }

// @Entity('factures')
// export class Facture {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column({ unique: true })
//   numero: string;

//   @Column({ type: 'date' })
//   dateFacture: Date;

//   @Column({ type: 'decimal', precision: 10, scale: 2 })
//   montantTotal: number;

//   @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
//   montantPaye: number;

//   @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
//   statut: InvoiceStatus;

//   @ManyToOne(() => Patient)
//   patient: Patient;

//   @ManyToMany(() => Seance)
//   @JoinTable({
//     name: 'facture_seances',
//     joinColumn: { name: 'factureId', referencedColumnName: 'id' },
//     inverseJoinColumn: { name: 'seanceId', referencedColumnName: 'id' },
//   })
//   seances: Seance[];

//   @OneToMany(() => Paiement, (paiement) => paiement.facture)
//   paiements: Paiement[];

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }
