import { Coin } from '../../../coin/entity/coin.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServicePackItem } from '../../item/entity/service-pack-item.entity';
import { Contract } from '../../../contract/entity/contract.entity';

@Entity()
export class ServicePack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  subscriptionPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  monthlyPayment: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  lateFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 5 })
  monthlyFee: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @JoinColumn({
    name: 'coinId',
    foreignKeyConstraintName: 'ServicePack_Coin_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Coin, (coin) => coin.servicePacks)
  coin: Coin;

  @OneToMany(() => ServicePackItem, (item) => item.servicePack)
  items: ServicePackItem[];

  @OneToMany(() => Contract, (contract) => contract.servicePack)
  contracts: Contract[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
