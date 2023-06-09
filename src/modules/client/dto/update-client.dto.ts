import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateClientDto {
  @ApiProperty({
    type: String,
    example: 'Steve Castle',
    required: true,
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;
}
