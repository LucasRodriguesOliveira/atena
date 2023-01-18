import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserType } from './entity/user-type.entity';
import { UserTypeController } from './user-type.controller';
import { UserTypeService } from './user-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserType]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [UserTypeService],
  controllers: [UserTypeController],
  exports: [UserTypeService],
})
export class UserTypeModule {}
