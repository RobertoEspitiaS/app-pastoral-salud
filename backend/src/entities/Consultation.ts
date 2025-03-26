import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PrescriptionItem } from './PrescriptionItem';

@Entity()
export class Consultation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column()
  date: Date;

  @Column({ type: 'text', nullable: true })
  diagnosis: string;

  @OneToMany(() => PrescriptionItem, (prescriptionItem) => prescriptionItem.consultation)
  prescription: PrescriptionItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 