import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '../type/contract-status.enum';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class QueryContractDto {
  @ApiProperty({
    type: ContractStatus,
    enum: ContractStatus,
    enumName: 'ContractStatus',
    name: 'status',
    required: true,
    example: ContractStatus.ACTIVE,
    default: ContractStatus.BOTH,
  })
  @IsEnum(ContractStatus)
  status: ContractStatus;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
    default: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number;

  @ApiProperty({
    type: Number,
    example: 1,
    required: false,
    default: 10,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  items?: number;
}
