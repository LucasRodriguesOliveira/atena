import { Contract } from '../../contract/entity/contract.entity';
import { Installment } from '../../installment/item/entity/installment.entity';
import { ServicePack } from '../../service-pack/service/entity/service-pack.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Coin {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 3 })
  acronym: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  value: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToMany(() => ServicePack, (servicePack) => servicePack.coin)
  servicePacks: ServicePack[];

  @OneToMany(() => Contract, (contract) => contract.coin)
  contracts: Contract[];

  @OneToMany(() => Installment, (installment) => installment.coin)
  installments: Installment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
