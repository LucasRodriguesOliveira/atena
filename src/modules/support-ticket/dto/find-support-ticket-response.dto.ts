import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Client } from '../../client/entity/client.entity';
import { User } from '../../user/entity/user.entity';
import { SupportTicket } from '../entity/support-ticket.entity';

export class FindSupportTicketClientResponseDto {
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

  static from({ id, name }: Client): FindSupportTicketClientResponseDto {
    return {
      id,
      name,
    };
  }
}

export class FindSupportTicketUserResponseDto {
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

  static from({ id, name }: User): FindSupportTicketUserResponseDto {
    return {
      id,
      name,
    };
  }
}

export class FindSupportTicketResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: FindSupportTicketClientResponseDto,
  })
  client: FindSupportTicketClientResponseDto;

  @ApiProperty({
    type: FindSupportTicketUserResponseDto,
  })
  user: FindSupportTicketUserResponseDto;

  @ApiProperty({
    type: String,
    example: 'Infinite loading screen when accessing user profile',
  })
  reason: string;

  @ApiProperty({
    type: String,
    example:
      'When accessing user profile, cannot proceed due to a never finishing loading screen',
  })
  details: string;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  static from({
    id,
    client,
    user,
    reason,
    details,
    createdAt,
    updatedAt,
  }: SupportTicket): FindSupportTicketResponseDto {
    return {
      id,
      client: FindSupportTicketClientResponseDto.from(client),
      user: FindSupportTicketUserResponseDto.from(user),
      reason,
      details,
      createdAt,
      updatedAt,
    };
  }
}
