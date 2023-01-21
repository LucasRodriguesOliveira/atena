import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TokenType } from './token-type.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  value: string;

  @ManyToOne(() => TokenType, (type) => type.token)
  @JoinColumn({
    name: 'typeId',
    foreignKeyConstraintName: 'Token_TokenType_fk',
    referencedColumnName: 'id',
  })
  type: TokenType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
