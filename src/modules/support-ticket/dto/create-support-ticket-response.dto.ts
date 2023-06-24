import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Client } from '../../client/entity/client.entity';
import { User } from '../../user/entity/user.entity';
import { SupportTicket } from '../entity/support-ticket.entity';

export class CreateSupportTicketClientResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'John Ericksen',
  })
  name: string;

  static from({ id, name }: Client): CreateSupportTicketClientResponseDto {
    return {
      id,
      name,
    };
  }
}

export class CreateSupportTicketUserResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Steve Carlton',
  })
  name: string;

  static from({ id, name }: User): CreateSupportTicketUserResponseDto {
    return {
      id,
      name,
    };
  }
}

export class CreateSupportTicketResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: CreateSupportTicketClientResponseDto,
  })
  client: CreateSupportTicketClientResponseDto;

  @ApiProperty({
    type: CreateSupportTicketUserResponseDto,
  })
  user: CreateSupportTicketUserResponseDto;

  @ApiProperty({
    type: String,
    example: 'Infinite loading screen when accessing user profile',
  })
  reason: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  static from({
    id,
    client,
    user,
    reason,
    createdAt,
  }: SupportTicket): CreateSupportTicketResponseDto {
    return {
      id,
      client: CreateSupportTicketClientResponseDto.from(client),
      user: CreateSupportTicketUserResponseDto.from(user),
      reason,
      createdAt,
    };
  }
}
