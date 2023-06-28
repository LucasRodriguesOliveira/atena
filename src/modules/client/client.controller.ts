import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
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
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ClientService } from './client.service';
import { ListClientResponseDto } from './dto/list-client-response.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { QueryClientDto } from './dto/query-client.dto';
import { PaginatedResult } from '../../shared/paginated-result.interface';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateClientResponseDto } from './dto/create-client-response.dto';
import { FindClientResponseDto } from './dto/find-client-response.dto';
import { randomUUID } from 'crypto';
import { UpdateClientResponseDto } from './dto/update-client-response.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('client')
@ApiTags('client')
@AppModule('CLIENT')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListClientResponseDto,
    isArray: true,
  })
  @ApiQuery({
    type: QueryClientDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe) queryClientDto: QueryClientDto,
  ): Promise<PaginatedResult<ListClientResponseDto>> {
    return this.clientService.list(queryClientDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateClientResponseDto,
  })
  @ApiBody({
    type: CreateClientDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createClientDto: CreateClientDto,
  ): Promise<CreateClientResponseDto> {
    return this.clientService.create(createClientDto);
  }

  @Get(':clientId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindClientResponseDto,
  })
  @ApiParam({
    type: String,
    name: 'clientId',
    example: randomUUID(),
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('clientId', ValidationPipe) clientId: string,
  ): Promise<FindClientResponseDto> {
    let client: FindClientResponseDto;

    try {
      client = await this.clientService.find(clientId);
    } catch (err) {
      throw new HttpException(
        `Could not find client [${clientId}]`,
        HttpStatus.NOT_FOUND,
      );
    }

    return client;
  }

  @Put(':clientId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateClientResponseDto,
  })
  @ApiParam({
    type: String,
    name: 'clientId',
    example: randomUUID(),
    required: true,
  })
  @ApiBody({
    type: UpdateClientDto,
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('clientId', ValidationPipe) clientId: string,
    @Body(ValidationPipe) updateClientDto: UpdateClientDto,
  ): Promise<UpdateClientResponseDto> {
    return this.clientService.update(clientId, updateClientDto);
  }

  @Delete(':clientId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @ApiParam({
    type: String,
    name: 'clientId',
    example: randomUUID(),
    required: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('clientId', ValidationPipe) clientId: string,
  ): Promise<boolean> {
    return this.clientService.delete(clientId);
  }
}
