import { IsInt, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MaxLength(50)
  @MinLength(3, { always: false })
  name?: string;

  @IsOptional()
  @MaxLength(50)
  @MinLength(3, { always: false })
  username?: string;

  @IsOptional()
  @MaxLength(150)
  @MinLength(5, { always: false })
  password?: string;

  @IsOptional()
  @IsInt()
  userTypeId?: number;
}
