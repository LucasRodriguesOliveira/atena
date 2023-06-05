import { Repository } from 'typeorm';
import { Module } from '../../../src/modules/module/entity/module.entity';
import { repository } from '../repository';
import { IRemoveOptions } from './iremove-options.interface';

export async function removeModule({ id }: IRemoveOptions): Promise<boolean> {
  const moduleRepository = repository.get(Module.name) as Repository<Module>;
  const { affected } = await moduleRepository.delete({ id });

  return affected > 0;
}
