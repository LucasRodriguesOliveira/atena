import { ApiProperty } from '@nestjs/swagger';
import { FindCoinServicePackReponseDto } from './find-coin-service-pack-response.dto';
import { randomUUID } from 'crypto';
import { ServicePack } from '../entity/service-pack.entity';

export class ListServicePackResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Basic',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'New here? Perfect Service Pack to start!',
  })
  description: string;

  @ApiProperty({
    type: Number,
    example: 49.99,
  })
  monthlyPayment: number;

  @ApiProperty({
    type: FindCoinServicePackReponseDto,
  })
  coin: FindCoinServicePackReponseDto;

  static map({
    id,
    name,
    description,
    monthlyPayment,
    coin,
  }: ServicePack): ListServicePackResponseDto {
    return {
      id,
      name,
      description,
      monthlyPayment,
      coin: FindCoinServicePackReponseDto.from(coin),
    };
  }

  static from(servicePacks: ServicePack[]): ListServicePackResponseDto[] {
    return servicePacks.map(ListServicePackResponseDto.map);
  }
}
