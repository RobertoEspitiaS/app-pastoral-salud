import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Consultation } from './Consultation';
import { Medication } from './Medication';

@Entity()
export class PrescriptionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Consultation, (consultation) => consultation.prescription)
  consultation: Consultation;

  @ManyToOne(() => Medication)
  medication: Medication;

  @Column()
  dosage: string;

  @Column()
  quantity: number;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 