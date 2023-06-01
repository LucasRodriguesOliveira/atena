import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
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
