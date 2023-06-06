import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { CompanyStatusEnum } from '../type/company-status.enum';
import { Type } from 'class-transformer';

export class QueryListCompanyDto {
  // can be used for both name and displayName
  @ApiProperty({
    type: String,
    example: 'Company co.',
    required: false,
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: CompanyStatusEnum,
    example: CompanyStatusEnum.ACTIVE,
    enum: CompanyStatusEnum,
    description: 'in the example, filters only active companies',
    required: false,
    default: CompanyStatusEnum.BOTH,
  })
  @IsEnum(CompanyStatusEnum)
  @IsOptional()
  status?: CompanyStatusEnum;

  @Type(() => Number)
  @ApiProperty({
    type: Number,
    description: 'page number',
    default: 0,
    minimum: 0,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  page: number;
}
