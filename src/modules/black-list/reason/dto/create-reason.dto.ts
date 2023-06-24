import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateReasonDto {
  @ApiProperty({
    type: String,
    example: 'Embezzlement',
    required: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  title: string;

  @ApiProperty({
    type: String,
    example: 'Tried to confuse the sales team to pay nothing for the services.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  details?: string;
}
