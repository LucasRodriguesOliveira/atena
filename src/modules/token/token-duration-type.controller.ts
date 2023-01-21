import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { TokenDurationTypeResponse } from './dto/create-token-duration-type-response.dto';
import { CreateTokenDurationTypeDto } from './dto/create-token-duration-type.dto';
import { UpdateTokenDurationTypeDto } from './dto/update-token-duration-type.dto';
import { TokenDurationType } from './entity/token-duration-type.entity';
import { TokenDurationTypeService } from './token-duration-type.service';

@Controller('token/duration-type')
export class TokenDurationTypeController {
  constructor(
    private readonly tokenDurationTypeService: TokenDurationTypeService,
  ) {}

  @Get()
  public async list(): Promise<TokenDurationType[]> {
    return this.tokenDurationTypeService.list();
  }

  @Get(':id')
  public async find(@Param('id') id: number): Promise<TokenDurationType> {
    return this.tokenDurationTypeService.find(id);
  }

  @ApiBody({ type: CreateTokenDurationTypeDto })
  @Post()
  public async create(
    @Body() dto: CreateTokenDurationTypeDto,
  ): Promise<TokenDurationTypeResponse> {
    return this.tokenDurationTypeService.create(dto);
  }

  @ApiBody({ type: UpdateTokenDurationTypeDto })
  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() { description }: UpdateTokenDurationTypeDto,
  ): Promise<TokenDurationType> {
    return this.tokenDurationTypeService.update(id, description);
  }

  @Delete(':id')
  public async delete(@Param('id') id: number): Promise<boolean> {
    return this.tokenDurationTypeService.delete(id);
  }
}
