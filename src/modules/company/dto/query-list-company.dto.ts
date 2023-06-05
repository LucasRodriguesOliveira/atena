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
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: CompanyStatusEnum,
    example: CompanyStatusEnum.ACTIVE,
    description: 'in the example, filters only active companies',
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
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  page: number;
}
