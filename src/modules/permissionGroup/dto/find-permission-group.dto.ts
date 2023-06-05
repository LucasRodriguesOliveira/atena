import { ApiProperty } from '@nestjs/swagger';
import { FindUserTypeDto } from './find-user-type.dto';
import { FindPermissionDto } from './find-permission.dto';
import { FindModuleDto } from './find-module.dto';
import { PermissionGroup } from '../entity/permission-group.entity';

export class FindPermissionGroupDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: FindUserTypeDto,
  })
  userType: FindUserTypeDto;

  @ApiProperty({
    type: FindPermissionDto,
  })
  permission: FindPermissionDto;

  @ApiProperty({
    type: FindModuleDto,
  })
  module: FindModuleDto;

  static from({
    id,
    userType,
    module,
    permission,
  }: PermissionGroup): FindPermissionGroupDto {
    return {
      id,
      userType: FindUserTypeDto.from(userType),
      module: FindModuleDto.from(module),
      permission: FindPermissionDto.from(permission),
    };
  }
}
