import { ApiProperty } from '@nestjs/swagger';
import { TokenType } from '../entity/token-type.entity';
import { CreateTokenDurationTypeResponse } from './create-token-duration-type-response.dto';

export class CreateTokenTypeResponse {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public description: string;

  @ApiProperty({ type: CreateTokenDurationTypeResponse })
  public durationType: CreateTokenDurationTypeResponse;

  @ApiProperty()
  public durationAmount: number;

  static from({
    id,
    description,
    durationType,
    durationAmount,
  }: TokenType): CreateTokenTypeResponse {
    return {
      id,
      description,
      durationType: CreateTokenDurationTypeResponse.from(durationType),
      durationAmount,
    };
  }
}
