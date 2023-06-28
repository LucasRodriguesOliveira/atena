import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
  Query,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompanyService } from './company.service';
import { FindCompanyResponseDto } from './dto/find-company-response.dto';
import { ListCompanyResponseDto } from './dto/list-company-response.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { QueryListCompanyDto } from './dto/query-list-company.dto';
import { PaginatedResult } from '../../shared/paginated-result.interface';
import { CreateCompanyResponseDto } from './dto/create-company-response.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyResponseDto } from './dto/update-company-response.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';
import { AppModule } from '../auth/decorator/app-module.decorator';

@Controller('company')
@ApiTags('company')
@AppModule('COMPANY')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: ListCompanyResponseDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('LIST')
  public async list(
    @Query(ValidationPipe) queryListCompanyDto?: QueryListCompanyDto,
  ): Promise<PaginatedResult<ListCompanyResponseDto>> {
    return this.companyService.list(queryListCompanyDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreateCompanyResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async create(
    @Body(ValidationPipe) createCompanyDto: CreateCompanyDto,
  ): Promise<CreateCompanyResponseDto> {
    return this.companyService.create(createCompanyDto);
  }

  @Get(':companyId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindCompanyResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async find(
    @Param('companyId', ValidationPipe) companyId: string,
  ): Promise<FindCompanyResponseDto> {
    let company: FindCompanyResponseDto;

    try {
      company = await this.companyService.find(companyId);
    } catch (err) {
      throw new NotFoundException('could not find the company');
    }

    return company;
  }

  @Put(':companyId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateCompanyResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('UPDATE')
  public async update(
    @Param('companyId', ValidationPipe) companyId: string,
    @Body(ValidationPipe) updateCompanyDto: UpdateCompanyDto,
  ): Promise<UpdateCompanyResponseDto> {
    return this.companyService.update(companyId, updateCompanyDto);
  }

  @Delete(':companyId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async delete(
    @Param('companyId', ValidationPipe) companyId: string,
  ): Promise<boolean> {
    return this.companyService.delete(companyId);
  }
}
