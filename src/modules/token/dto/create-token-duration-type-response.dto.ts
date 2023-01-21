import { TokenDurationType } from '../entity/token-duration-type.entity';

export interface TokenDurationTypeResponse {
  id: number;
  description: string;
}

export class CreateTokenDurationTypeResponseDto {
  static from({
    id,
    description,
  }: TokenDurationType): TokenDurationTypeResponse {
    return {
      id,
      description,
    };
  }
}
