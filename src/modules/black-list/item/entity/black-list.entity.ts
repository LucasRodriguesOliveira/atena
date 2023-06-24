import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from '../../../client/entity/client.entity';
import { Reason } from '../../reason/entity/reason.entity';

@Entity({ name: 'client_black_list' })
export class BlackList {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @JoinColumn({
    name: 'clientId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'ClientBlackList_Client_fk',
  })
  @OneToOne(() => Client)
  client: Client;

  @JoinColumn({
    name: 'reasonId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'ClientBlackList_ClientBlackListReason_fk',
  })
  @ManyToOne(() => Reason, (reason) => reason.items)
  reason: Reason;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
