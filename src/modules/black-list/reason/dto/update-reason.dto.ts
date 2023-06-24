import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateReasonDto {
  @ApiProperty({
    type: String,
    example: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  title?: string;

  @ApiProperty({
    type: String,
    example: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  details?: string;
}
