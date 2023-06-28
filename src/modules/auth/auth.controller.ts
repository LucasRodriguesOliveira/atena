import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AppModule } from './decorator/app-module.decorator';
import { JwtGuard } from './guard/jwt.guard';
import { RoleGuard } from './guard/role.guard';
import { AccessPermission } from './decorator/access-permission.decorator';

@Controller('auth')
@ApiTags('auth')
@AppModule('AUTH')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RoleGuard)
  @AccessPermission('REGISTER')
  public async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<boolean> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    type: String,
    description: 'token string',
    status: HttpStatus.OK,
  })
  public async login(@Body() loginDto: LoginDto): Promise<string> {
    return this.authService.login(loginDto);
  }
}
