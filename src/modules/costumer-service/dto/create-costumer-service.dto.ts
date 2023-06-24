import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { randomInt, randomUUID } from 'crypto';

export class CreateCostumerServiceDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  clientId: string;

  @ApiProperty({
    type: String,
    example: randomUUID(),
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  serviceStageId: number;
}
