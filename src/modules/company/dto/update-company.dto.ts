import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCompanyDto {
  @ApiProperty({
    type: String,
    example: 'CPNY LTDA',
    maxLength: 50,
    minLength: 3,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @MinLength(3)
  name?: string;

  @ApiProperty({
    type: String,
    example: 'Great Company',
    maxLength: 50,
    minLength: 3,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @MinLength(3)
  displayName?: string;

  @ApiProperty({
    type: String,
    example: 'great_cpny@email.com',
    maxLength: 100,
    minLength: 3,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @MinLength(3)
  email?: string;
}
