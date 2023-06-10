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
import { ServicePack } from '../../service-pack/service/entity/service-pack.entity';
import { Client } from '../../client/entity/client.entity';
import { Company } from '../../company/entity/company.entity';
import { Coin } from '../../coin/entity/coin.entity';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({
    name: 'servicePackId',
    foreignKeyConstraintName: 'Contract_ServicePack_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => ServicePack, (servicePack) => servicePack.contracts)
  servicePack: ServicePack;

  @JoinColumn({
    name: 'clientId',
    foreignKeyConstraintName: 'Contract_Client_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Client, (client) => client.contracts)
  client: Client;

  @JoinColumn({
    name: 'companyId',
    foreignKeyConstraintName: 'Contract_Company_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Company, (company) => company.contracts)
  company: Company;

  @JoinColumn({
    name: 'coinId',
    foreignKeyConstraintName: 'Contract_Coin_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Coin, (coin) => coin.contracts)
  coin: Coin;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  subscriptionPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  monthlyPayment: number;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  lateFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 5 })
  monthlyFee: number;

  @Column({ type: 'date' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
