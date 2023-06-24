import { ApiProperty } from '@nestjs/swagger';
import { randomInt, randomUUID } from 'crypto';
import { Client } from '../../client/entity/client.entity';
import { User } from '../../user/entity/user.entity';
import { ServiceStage } from '../../service-stage/entity/service-stage.entity';
import { CostumerService } from '../entity/costumer-service.entity';

export class FindCostumerServiceClient {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Alex Smith',
  })
  name: string;

  static from({ id, name }: Client): FindCostumerServiceClient {
    return {
      id,
      name,
    };
  }
}

export class FindCostumerServiceUser {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'John Doe',
  })
  name: string;

  static from({ id, name }: User): FindCostumerServiceUser {
    return {
      id,
      name,
    };
  }
}

export class FindCostumerServiceServiceStage {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'Waiting for service',
  })
  description: string;

  static from({
    id,
    description,
  }: ServiceStage): FindCostumerServiceServiceStage {
    return {
      id,
      description,
    };
  }
}

export class FindCostumerServiceResponseDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  id: number;

  @ApiProperty({
    type: FindCostumerServiceClient,
  })
  client: FindCostumerServiceClient;

  @ApiProperty({
    type: FindCostumerServiceUser,
  })
  user: FindCostumerServiceUser;

  @ApiProperty({
    type: FindCostumerServiceServiceStage,
  })
  serviceStage: FindCostumerServiceServiceStage;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    client,
    user,
    serviceStage,
    createdAt,
    updatedAt,
  }: CostumerService): FindCostumerServiceResponseDto {
    return {
      id,
      client: FindCostumerServiceClient.from(client),
      user: FindCostumerServiceUser.from(user),
      serviceStage: FindCostumerServiceServiceStage.from(serviceStage),
      createdAt,
      updatedAt,
    };
  }
}
