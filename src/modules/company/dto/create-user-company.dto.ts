import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class CreateUserCompanyDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
    required: true,
  })
  @IsUUID()
  @IsString()
  userId: string;
}
