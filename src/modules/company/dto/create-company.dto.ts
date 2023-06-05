import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    type: String,
    example: 'CPNY LTDA',
    maxLength: 50,
    minLength: 3,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  name: string;

  @ApiProperty({
    type: String,
    example: 'Great Company',
    maxLength: 50,
    minLength: 3,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  displayName: string;

  @ApiProperty({
    type: String,
    example: 'great_cpny@email.com',
    maxLength: 100,
    minLength: 3,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @MinLength(3)
  email: string;
}
