import { ApiProperty } from '@nestjs/swagger';
import { TokenDurationType } from '../entity/token-duration-type.entity';

export class CreateTokenDurationTypeResponse {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public description: string;

  static from({
    id,
    description,
  }: TokenDurationType): CreateTokenDurationTypeResponse {
    return {
      id,
      description,
    };
  }
}
