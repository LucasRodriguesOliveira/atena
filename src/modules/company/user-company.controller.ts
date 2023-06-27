import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppModule } from '../auth/decorator/app-module.decorator';
import { UserCompanyService } from './user-company.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { RoleGuard } from '../auth/guard/role.guard';
import { CreateUserCompanyResponseDto } from './dto/create-user-company-response.dto';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { AccessPermission } from '../auth/decorator/access-permission.decorator';

@Controller('company/:companyId/user')
@ApiTags('company')
@AppModule('USER_COMPANY')
export class UserCompanyController {
  constructor(private readonly userCompanyService: UserCompanyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: FindUsersDto,
    isArray: true,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('FIND')
  public async findUsers(
    @Param('companyId') companyId: string,
  ): Promise<FindUsersDto[]> {
    return this.userCompanyService.findUsers(companyId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CreateUserCompanyResponseDto,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('CREATE')
  public async attachUser(
    @Param('companyId', ValidationPipe) companyId: string,
    @Body(ValidationPipe) createUserCompanyDto: CreateUserCompanyDto,
  ): Promise<CreateUserCompanyResponseDto> {
    return this.userCompanyService.attachUser(companyId, createUserCompanyDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: Boolean,
  })
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('DELETE')
  public async deattachUser(
    @Param('userCompanyId', ValidationPipe) userCompanyId: number,
  ): Promise<boolean> {
    return this.userCompanyService.deattachUser(userCompanyId);
  }
}
