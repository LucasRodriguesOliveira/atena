import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { ListContractResponseDto } from './dto/list-contract-response.dto';
import { QueryContractDto } from './dto/query-contract.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { CreateContractResponseDto } from './dto/create-contract-response.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { FindContractResponseDto } from './dto/find-contract-response.dto';
import { randomUUID } from 'crypto';
import { UpdateContractResponseDto } from './dto/update-contract-response.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('contract')
@ApiTags('contract')
@AppModule('CONTRACT')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListContractResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe) queryContractDto: QueryContractDto,
  ): Promise<ListContractResponseDto> {
    return this.contractService.list(queryContractDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateContractResponseDto,
  })
  @ApiBody({
    type: CreateContractDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createContractDto: CreateContractDto,
  ): Promise<CreateContractResponseDto> {
    return this.contractService.create(createContractDto);
  }

  @Get(':contractId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindContractResponseDto,
  })
  @ApiNotFoundResponse()
  @ApiParam({
    type: String,
    name: 'contractId',
    example: randomUUID(),
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('contractId', ValidationPipe) contractId: string,
  ): Promise<FindContractResponseDto> {
    let contract: FindContractResponseDto;

    try {
      contract = await this.contractService.find(contractId);
    } catch (err) {
      throw new NotFoundException(
        `Could not find the Contract [${contractId}]`,
      );
    }

    return contract;
  }

  @Put(':contractId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateContractResponseDto,
  })
  @ApiBody({
    type: UpdateContractDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('contractId', ValidationPipe) contractId: string,
    @Body(ValidationPipe) updateContractDto: UpdateContractDto,
  ): Promise<UpdateContractResponseDto> {
    return this.contractService.update(contractId, updateContractDto);
  }

  @Delete(':contractId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('contractId', ValidationPipe) contractId: string,
  ): Promise<boolean> {
    return this.contractService.delete(contractId);
  }
}
