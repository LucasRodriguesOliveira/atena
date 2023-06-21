import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateServiceStageDto {
  @ApiProperty({
    type: String,
    example: 'New description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
