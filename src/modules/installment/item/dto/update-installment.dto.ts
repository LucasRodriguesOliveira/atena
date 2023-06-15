import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateInstallmentDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  value: number;
}
