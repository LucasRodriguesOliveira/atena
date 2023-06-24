import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTicket } from './entity/support-ticket.entity';
import { User } from '../user/entity/user.entity';
import { Client } from '../client/entity/client.entity';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicketController } from './support-ticket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SupportTicket, User, Client])],
  providers: [SupportTicketService],
  controllers: [SupportTicketController],
})
export class SupportTicketModule {}
