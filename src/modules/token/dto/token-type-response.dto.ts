import { ApiProperty } from '@nestjs/swagger';
import { TokenType } from '../entity/token-type.entity';

class DurationType {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'MONTH' })
  description: string;
}

export class TokenTypeResponse {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: 'LOGIN_LONG_TERM' })
  public description: string;

  @ApiProperty()
  public durationType: DurationType;

  @ApiProperty({ example: 3 })
  public durationAmount: number;

  @ApiProperty({ example: new Date() })
  public createdAt: Date;

  static from({
    id,
    description,
    durationType,
    durationAmount,
    createdAt,
  }: TokenType): TokenTypeResponse {
    return {
      id,
      description,
      durationType,
      durationAmount,
      createdAt,
    };
  }
}
