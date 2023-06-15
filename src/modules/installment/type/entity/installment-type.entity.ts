import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Installment } from '../../item/entity/installment.entity';

@Entity()
export class InstallmentType {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToMany(() => Installment, (installment) => installment.installmentType)
  installments: Installment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
