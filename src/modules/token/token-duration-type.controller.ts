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
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateTokenDurationTypeResponse } from './dto/create-token-duration-type-response.dto';
import { CreateTokenDurationTypeDto } from './dto/create-token-duration-type.dto';
import { UpdateTokenDurationTypeDto } from './dto/update-token-duration-type.dto';
import { TokenDurationType } from './entity/token-duration-type.entity';
import { TokenDurationTypeService } from './token-duration-type.service';

@ApiTags('token')
@Controller('token/duration-type')
export class TokenDurationTypeController {
  constructor(
    private readonly tokenDurationTypeService: TokenDurationTypeService,
  ) {}

  @ApiOkResponse({
    description: 'List of all Token Duration types',
    type: TokenDurationType,
    isArray: true,
  })
  @Get()
  public async list(): Promise<TokenDurationType[]> {
    return this.tokenDurationTypeService.list();
  }

  @ApiOkResponse({
    description: 'Details about specified Duration Type of a Token',
    type: TokenDurationType,
  })
  @ApiNotFoundResponse({
    description: 'Duration type could not be found',
  })
  @Get(':id')
  public async find(@Param('id') id: number): Promise<TokenDurationType> {
    const tokenDurationType = await this.tokenDurationTypeService.find(id);

    if (!tokenDurationType) {
      throw new HttpException(
        'Duration type could not be found',
        HttpStatus.NOT_FOUND,
      );
    }

    return tokenDurationType;
  }

  @ApiBody({ type: CreateTokenDurationTypeDto })
  @ApiCreatedResponse({
    description: 'Token Duration type created',
    type: TokenDurationType,
  })
  @Post()
  public async create(
    @Body() dto: CreateTokenDurationTypeDto,
  ): Promise<CreateTokenDurationTypeResponse> {
    return this.tokenDurationTypeService.create(dto);
  }

  @ApiCreatedResponse({
    description: 'Token Duration type updated',
    type: TokenDurationType,
  })
  @ApiBody({ type: UpdateTokenDurationTypeDto })
  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() { description }: UpdateTokenDurationTypeDto,
  ): Promise<TokenDurationType> {
    return this.tokenDurationTypeService.update(id, description);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Token Duration Type removed',
    type: Boolean,
  })
  public async delete(@Param('id') id: number): Promise<boolean> {
    return this.tokenDurationTypeService.delete(id);
  }
}
