import { CreateUserTypeTable1685899894356 } from './migrations/1685899894356-Create_UserType_Table';
import { CreatePermissionTable1685914015563 } from './migrations/1685914015563-CreatePermissionTable';
import { CreateModuleTable1685914244436 } from './migrations/1685914244436-CreateModuleTable';
import { CreateUserTable1685914446039 } from './migrations/1685914446039-CreateUserTable';
import { CreatePermissionGroup1685915534635 } from './migrations/1685915534635-CreatePermissionGroup';
import { InsertUserTypeAdmin1685913570751 } from './migrations/1685913570751-InsertUserTypeAdmin';
import { InsertUserTypeDefault1685913681434 } from './migrations/1685913681434-InsertUserTypeDefault';
import { CreateCompanyTable1685952673621 } from './migrations/1685952673621-CreateCompanyTable';
import { CreateUserCompanyTable1686013139886 } from './migrations/1686013139886-CreateUserCompanyTable';
import { CreateCoinTable1686058866888 } from './migrations/1686058866888-CreateCoinTable';
import { CreateServicePackItemTypeTable1686094231747 } from './migrations/1686094231747-CreateServicePackItemTypeTable';
import { CreatePaymentMethodTable1686143580143 } from './migrations/1686143580143-CreatePaymentMethodTable';
import { CreateServicePackTable1686186968401 } from './migrations/1686186968401-CreateServicePackTable';
import { CreateServicePackItemTable1686265843803 } from './migrations/1686265843803-CreateServicePackItemTable';
import { CreateClientTable1686317728502 } from './migrations/1686317728502-CreateClientTable';

export const migrations = [
  CreateUserTypeTable1685899894356,
  CreatePermissionTable1685914015563,
  CreateModuleTable1685914244436,
  InsertUserTypeAdmin1685913570751,
  InsertUserTypeDefault1685913681434,
  CreateUserTable1685914446039,
  CreatePermissionGroup1685915534635,
  CreateCompanyTable1685952673621,
  CreateUserCompanyTable1686013139886,
  CreateCoinTable1686058866888,
  CreateServicePackItemTypeTable1686094231747,
  CreatePaymentMethodTable1686143580143,
  CreateServicePackTable1686186968401,
  CreateServicePackItemTable1686265843803,
  CreateClientTable1686317728502,
];
