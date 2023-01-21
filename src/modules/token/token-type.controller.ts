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
import { CreateTokenTypeDto } from './dto/create-token-type.dto';
import { UpdateTokenTypeDto } from './dto/update-token-type.dto';
import { TokenType } from './entity/token-type.entity';
import { TokenTypeService } from './token-type.service';

@Controller('token/type')
export class TokenTypeController {
  constructor(private readonly tokenTypeService: TokenTypeService) {}

  @Get()
  public async list(): Promise<TokenType[]> {
    return this.tokenTypeService.list();
  }

  @Get(':id')
  public async findById(@Param('id') id: number): Promise<TokenType> {
    return this.tokenTypeService.findById(id);
  }

  @ApiBody({ type: CreateTokenTypeDto })
  @Post()
  public async create(@Body() dto: CreateTokenTypeDto): Promise<TokenType> {
    return this.tokenTypeService.create(dto);
  }

  @ApiBody({ type: UpdateTokenTypeDto })
  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() dto: UpdateTokenTypeDto,
  ): Promise<TokenType> {
    return this.tokenTypeService.update(id, dto);
  }

  @Delete(':id')
  public async delete(@Param('id') id: number): Promise<boolean> {
    return this.tokenTypeService.delete(id);
  }
}
