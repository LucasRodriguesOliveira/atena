import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateServiceStageDto {
  @ApiProperty({
    type: String,
    example: 'Not interested',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  description: string;
}
