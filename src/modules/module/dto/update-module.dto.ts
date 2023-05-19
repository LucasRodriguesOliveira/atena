import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateModuleDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  @IsNotEmpty()
  description: string;
}
