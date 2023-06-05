import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGroup } from './entity/permission-group.entity';
import { PermissionGroupService } from './permission-group.service';
import { PermissionGroupController } from './permission-group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionGroup])],
  providers: [PermissionGroupService],
  controllers: [PermissionGroupController],
})
export class PermissionGroupModule {}
