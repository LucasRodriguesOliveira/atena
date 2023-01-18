import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeModule } from '../user-type/user-type.module';
import { UserTypeService } from '../user-type/user-type.service';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserTypeModule],
  providers: [UserService, UserTypeService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
