import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
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
import { UserRole } from '../auth/decorator/user-type.decorator';
import { UserTypeEnum } from '../user-type/type/user-type.enum';
import { QueryListCompanyDto } from './dto/query-list-company.dto';
import { PaginatedResult } from '../../shared/paginated-result.interface';
import { CreateCompanyResponseDto } from './dto/create-company-response.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyResponseDto } from './dto/update-company-response.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserCompanyService } from './user-company.service';
import { FindUsersDto } from './dto/find-users.dto';
import { CreateUserCompanyResponseDto } from './dto/create-user-company-response.dto';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';

@Controller('company')
@ApiTags('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly userCompanyService: UserCompanyService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [ListCompanyResponseDto],
    description: 'List of companies',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async list(
    @Query(ValidationPipe) queryListCompanyDto?: QueryListCompanyDto,
  ): Promise<PaginatedResult<ListCompanyResponseDto>> {
    return this.companyService.list(queryListCompanyDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CreateCompanyResponseDto,
    description: 'Company created',
  })
  @ApiBearerAuth()
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
    description: 'Company found by id',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async find(
    @Param('companyId', ValidationPipe) companyId: string,
  ): Promise<FindCompanyResponseDto> {
    return this.companyService.find(companyId);
  }

  @Put(':companyId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UpdateCompanyResponseDto,
    description: 'Company updated',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
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
    description: 'Confirmation of exclusion of company',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async delete(
    @Param('companyId', ValidationPipe) companyId: string,
  ): Promise<boolean> {
    return this.companyService.delete(companyId);
  }

  @Get(':companyId/user')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: [FindUsersDto],
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async findUsers(
    @Param('companyId') companyId: string,
  ): Promise<FindUsersDto[]> {
    return this.userCompanyService.findUsers(companyId);
  }

  @Post(':companyId/user')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateUserCompanyResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async attachUser(
    @Param('companyId', ValidationPipe) companyId: string,
    @Body(ValidationPipe) createUserCompanyDto: CreateUserCompanyDto,
  ): Promise<CreateUserCompanyResponseDto> {
    return this.userCompanyService.attachUser(companyId, createUserCompanyDto);
  }

  @Delete(':userCompanyId/user')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
    description:
      'Confirmation of the exclusion of the connection between company and user',
  })
  @UseGuards(JwtGuard, RoleGuard)
  @UserRole(UserTypeEnum.ADMIN)
  public async deattachUser(
    @Param('userCompanyId', ValidationPipe) userCompanyId: number,
  ): Promise<boolean> {
    console.log('userCompanyId', userCompanyId);
    return this.userCompanyService.deattachUser(userCompanyId);
  }
}
