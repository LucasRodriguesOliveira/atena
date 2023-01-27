import { ApiProperty } from '@nestjs/swagger';
import { TokenType } from '../entity/token-type.entity';

export class TokenTypeListResponse {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public durationTypeId: number;

  @ApiProperty()
  public durationAmount: number;

  static from(tokenTypes: TokenType[]): TokenTypeListResponse[] {
    return tokenTypes.map(
      ({ id, description, durationType, durationAmount }: TokenType) => ({
        id,
        description,
        durationTypeId: durationType.id,
        durationAmount,
      }),
    );
  }
}
