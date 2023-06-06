import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateServicePackItemTypeDto {
  @ApiProperty({
    type: String,
    description: 'TOP_PAGE_7_DAYS',
    required: true,
  })
  @IsString()
  @MaxLength(50)
  @MinLength(3)
  description: string;
}
