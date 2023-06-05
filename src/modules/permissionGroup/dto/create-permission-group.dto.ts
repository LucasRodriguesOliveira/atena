import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePermissionGroupDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @Min(1)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  userTypeId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @Min(1)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  moduleId: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  @Min(1)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  permissionId: number;
}
