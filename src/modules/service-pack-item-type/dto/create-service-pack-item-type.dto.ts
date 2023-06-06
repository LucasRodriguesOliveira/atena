import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateServicePackItemTypeDto {
  @ApiProperty({
    type: String,
    description: 'TOP_PAGE_7_DAYS',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  description: string;
}
