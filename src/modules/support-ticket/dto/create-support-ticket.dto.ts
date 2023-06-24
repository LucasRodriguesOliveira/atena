import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class CreateSupportTicketDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: String,
    example: 'Wrong results',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  reason: string;

  @ApiProperty({
    type: String,
    example: 'wrong results when searching for service packs',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  details: string;
}
