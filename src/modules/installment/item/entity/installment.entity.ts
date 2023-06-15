import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contract } from '../../../contract/entity/contract.entity';
import { InstallmentType } from '../../type/entity/installment-type.entity';
import { PaymentMethod } from '../../../payment-method/entity/payment-method.entity';
import { Coin } from '../../../coin/entity/coin.entity';

@Entity()
export class Installment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({
    name: 'contractId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'Installment_Contract_fk',
  })
  @ManyToOne(() => Contract, (contract) => contract.installments)
  contract: Contract;

  @JoinColumn({
    name: 'installmentTypeId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'Installment_InstallmentType_fk',
  })
  @ManyToOne(
    () => InstallmentType,
    (installmentType) => installmentType.installments,
  )
  installmentType: InstallmentType;

  @JoinColumn({
    name: 'paymentMethodId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'Installment_PaymentMethod_fk',
  })
  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.installments)
  paymentMethod: PaymentMethod;

  @JoinColumn({
    name: 'coinId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'Installment_Coin_fk',
  })
  @ManyToOne(() => Coin, (coin) => coin.installments)
  coin: Coin;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  valuePaid: number;

  @Column({ type: 'date' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
