import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceStage } from '../../service-stage/entity/service-stage.entity';
import { User } from '../../user/entity/user.entity';
import { Client } from '../../client/entity/client.entity';

@Entity()
export class CostumerService {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @JoinColumn({
    name: 'clientId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'CostumerService_Client_fk',
  })
  @ManyToOne(() => Client, (client) => client.costumerServices)
  client: Client;

  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'CostumerService_User_fk',
  })
  @ManyToOne(() => User, (user) => user.costumerServices)
  user: User;

  @JoinColumn({
    name: 'serviceStageId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'CostumerService_ServiceStage_fk',
  })
  @ManyToOne(
    () => ServiceStage,
    (serviceStage) => serviceStage.costumerServices,
  )
  serviceStage: ServiceStage;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
