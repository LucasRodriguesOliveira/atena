import { IsBoolean, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Min(3)
  @Max(50)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Min(5)
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  remember: boolean;
}
