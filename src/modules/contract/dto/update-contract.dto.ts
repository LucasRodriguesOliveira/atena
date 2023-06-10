import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateContractDto {
  @ApiProperty({
    type: Boolean,
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
