import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServicePackItemType } from '../../item-type/entity/service-pack-item-type.entity';
import { ServicePack } from '../../service/entity/service-pack.entity';

@Entity()
export class ServicePackItem {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @JoinColumn({
    name: 'itemTypeId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'ServicePackItem_ServicePackItemType_fk',
  })
  @ManyToOne(() => ServicePackItemType, (itemType) => itemType.items)
  itemType: ServicePackItemType;

  @JoinColumn({
    name: 'servicePackId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'ServicePackItem_ServicePack_fk',
  })
  @ManyToOne(() => ServicePack, (servicePack) => servicePack.items)
  servicePack: ServicePack;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
