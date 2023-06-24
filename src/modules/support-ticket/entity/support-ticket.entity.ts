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
import { Client } from '../../client/entity/client.entity';
import { User } from '../../user/entity/user.entity';

@Entity({ name: 'support_ticket' })
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn({
    name: 'clientId',
    foreignKeyConstraintName: 'SupportTicket_Client_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => Client, (client) => client.tickets)
  client: Client;

  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'SupportTicket_User_fk',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @Column({ type: 'varchar', length: 50 })
  reason: string;

  @Column({ type: 'text' })
  details: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
