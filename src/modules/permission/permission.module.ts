import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}
