import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTokenDurationTypeResponse } from './dto/create-token-duration-type-response.dto';
import { CreateTokenTypeDto } from './dto/create-token-type.dto';
import { TokenTypeListResponse } from './dto/token-type-list-response.dto';
import { UpdateTokenTypeDto } from './dto/update-token-type.dto';
import { TokenType } from './entity/token-type.entity';
import { TokenTypeService } from './token-type.service';

@ApiTags('token')
@Controller('token/type')
export class TokenTypeController {
  constructor(private readonly tokenTypeService: TokenTypeService) {}

  @ApiOkResponse({
    type: [TokenTypeListResponse],
    description: 'List of all Token Types',
  })
  @Get()
  public async list(): Promise<TokenTypeListResponse[]> {
    return this.tokenTypeService.list();
  }

  @ApiOkResponse({
    type: TokenType,
    description: 'Token Type specified by id',
  })
  @ApiNotFoundResponse({
    description: 'Token Type could not be found',
  })
  @Get(':id')
  public async findById(@Param('id') id: number): Promise<TokenType> {
    const tokenType = await this.tokenTypeService.findById(id);

    if (!tokenType) {
      throw new HttpException(
        'Token Type could not be found',
        HttpStatus.NOT_FOUND,
      );
    }

    return tokenType;
  }

  @ApiBody({ type: CreateTokenTypeDto })
  @ApiCreatedResponse({
    type: TokenType,
    description: 'Created Token Type',
  })
  @Post()
  public async create(
    @Body() dto: CreateTokenTypeDto,
  ): Promise<CreateTokenDurationTypeResponse> {
    return this.tokenTypeService.create(dto);
  }

  @ApiBody({ type: UpdateTokenTypeDto })
  @ApiCreatedResponse({
    type: TokenType,
    description: 'Updated Token Type',
  })
  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() dto: UpdateTokenTypeDto,
  ): Promise<TokenType> {
    return this.tokenTypeService.update(id, dto);
  }

  @ApiOkResponse({
    type: Boolean,
    description: 'Returns true if the delete was successfull',
  })
  @Delete(':id')
  public async delete(@Param('id') id: number): Promise<boolean> {
    return this.tokenTypeService.delete(id);
  }
}
