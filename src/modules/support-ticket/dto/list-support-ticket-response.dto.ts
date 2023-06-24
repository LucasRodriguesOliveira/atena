import { ApiProperty } from '@nestjs/swagger';
import { randomInt, randomUUID } from 'crypto';
import { Client } from '../../client/entity/client.entity';
import { User } from '../../user/entity/user.entity';
import { SupportTicket } from '../entity/support-ticket.entity';
import { PaginatedResult } from '../../../shared/paginated-result.interface';

export class ListSupportTicketClientResponseDto {
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

  static from({ id, name }: Client): ListSupportTicketClientResponseDto {
    return {
      id,
      name,
    };
  }
}

export class ListSupportTicketUserResponseDto {
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

  static from({ id, name }: User): ListSupportTicketUserResponseDto {
    return {
      id,
      name,
    };
  }
}

export class ListItemSupportTicketResponseDto {
  @ApiProperty({
    type: String,
    example: randomUUID(),
  })
  id: string;

  @ApiProperty({
    type: ListSupportTicketClientResponseDto,
  })
  client: ListSupportTicketClientResponseDto;

  @ApiProperty({
    type: ListSupportTicketUserResponseDto,
  })
  user: ListSupportTicketUserResponseDto;

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
  }: SupportTicket): ListItemSupportTicketResponseDto {
    return {
      id,
      client: ListSupportTicketClientResponseDto.from(client),
      user: ListSupportTicketUserResponseDto.from(user),
      reason,
      createdAt,
    };
  }
}

export class ListSupportTicketResponseDto
  implements PaginatedResult<ListItemSupportTicketResponseDto>
{
  @ApiProperty({
    type: ListItemSupportTicketResponseDto,
  })
  data: ListItemSupportTicketResponseDto[];

  @ApiProperty({
    type: Number,
    example: randomInt(10, 100),
  })
  total: number;

  static from(
    supportTickets: SupportTicket[],
    total: number,
  ): ListSupportTicketResponseDto {
    return {
      data: supportTickets.map(ListItemSupportTicketResponseDto.from),
      total,
    };
  }
}
