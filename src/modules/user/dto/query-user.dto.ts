import { IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  username?: string;
}
