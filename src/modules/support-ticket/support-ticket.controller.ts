import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  HttpException,
  UseGuards,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SupportTicketService } from './support-ticket.service';
import { ListSupportTicketResponseDto } from './dto/list-support-ticket-response.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { QuerySupportTicketDto } from './dto/query-support-ticket.dto';
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto';
import { CreateSupportTicketResponseDto } from './dto/create-support-ticket-response.dto';
import { FindSupportTicketResponseDto } from './dto/find-support-ticket-response.dto';

@Controller('support-ticket')
@ApiTags('support-ticket')
export class SupportTicketController {
  constructor(private readonly supportTicketService: SupportTicketService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListSupportTicketResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async list(
    @Query(ValidationPipe) querySupportTicketDto: QuerySupportTicketDto,
  ): Promise<ListSupportTicketResponseDto> {
    return this.supportTicketService.list(querySupportTicketDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateSupportTicketResponseDto,
  })
  @ApiBody({
    type: CreateSupportTicketDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async create(
    @Body(ValidationPipe) createSupportTicketDto: CreateSupportTicketDto,
  ): Promise<CreateSupportTicketResponseDto> {
    return this.supportTicketService.create(createSupportTicketDto);
  }

  @Get(':supportTicketId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindSupportTicketResponseDto,
  })
  @ApiNotFoundResponse()
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('supportTicketId', ParseUUIDPipe) supportTicketId: string,
  ): Promise<FindSupportTicketResponseDto> {
    let supportTicket: FindSupportTicketResponseDto;

    try {
      supportTicket = await this.supportTicketService.find(supportTicketId);
    } catch (err) {
      throw new HttpException(
        'could not find the support ticket',
        HttpStatus.NOT_FOUND,
      );
    }

    return supportTicket;
  }

  @Delete(':supportTicketId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('supportTicketId', ParseUUIDPipe) supportTicketId: string,
  ): Promise<boolean> {
    return this.supportTicketService.delete(supportTicketId);
  }
}
