import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateCoinDto {
  @ApiProperty({
    type: String,
    example: 'Euro',
    required: true,
  })
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  name: string;

  @ApiProperty({
    type: String,
    example: 'EUR',
    required: true,
  })
  @IsString()
  @MaxLength(3)
  @MinLength(3)
  acronym: string;

  @ApiProperty({
    type: Number,
    example: 1.07,
    required: true,
  })
  @IsNumber()
  @Min(0)
  value: number;
}
