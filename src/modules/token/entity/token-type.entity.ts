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
import { TokenDurationType } from './token-duration-type.entity';
import { Token } from './token.entity';

@Entity()
export class TokenType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  description: string;

  @ManyToOne(() => TokenDurationType, (durationType) => durationType.tokenType)
  @JoinColumn({
    name: 'durationTypeId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'TokenType_TokenDurationType_fk',
  })
  durationType: TokenDurationType;

  @OneToMany(() => Token, (token) => token.type)
  token: Token[];

  @Column({ type: 'int' })
  durationAmount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  udpatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
