import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class QueryInstallmentDto {
  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  servicePackId?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  companyId?: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  installmentTypeId?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => Number(value))
  coinId?: number;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => /^true$/.test(value))
  isExpired?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => /^true$/.test(value))
  isPaid?: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => /^true$/.test(value))
  isValueDivergent?: boolean;

  @ApiProperty({
    type: Number,
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    type: Number,
    required: false,
    default: 10,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Max(100)
  @Type(() => Number)
  items?: number;
}
