import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { randomInt } from 'crypto';

export class UpdateBlackListDto {
  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  reasonId: number;
}
