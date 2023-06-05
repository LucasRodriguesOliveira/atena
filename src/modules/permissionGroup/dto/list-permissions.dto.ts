import { ApiProperty } from '@nestjs/swagger';
import { FindPermissionDto } from './find-permission.dto';
import { PermissionGroup } from '../entity/permission-group.entity';

export class ListPermissionsDto {
  @ApiProperty({
    type: Number,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: FindPermissionDto,
  })
  permission: FindPermissionDto;

  static from({ id, permission }: PermissionGroup): ListPermissionsDto {
    return {
      id,
      permission: FindPermissionDto.from(permission),
    };
  }
}
