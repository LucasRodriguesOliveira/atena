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
import { CreateContractTable1686317824187 } from './migrations/1686317824187-CreateContractTable';
import { CreateInstallmentTypeTable1686441514910 } from './migrations/1686441514910-CreateInstallmentTypeTable';
import { CreateInstallmentTable1686447882372 } from './migrations/1686447882372-CreateInstallmentTable';
import { CreateServiceStageTable1686949375328 } from './migrations/1686949375328-CreateServiceStageTable';
import { CreateCostumerServiceTable1687382298320 } from './migrations/1687382298320-CreateCostumerServiceTable';
import { CreateClientBlackListReasonTable1687568092067 } from './migrations/1687568092067-CreateClientBlackListReasonTable';
import { CreateClientBlackListTable1687574010200 } from './migrations/1687574010200-CreateClientBlackListTable';
import { CreateSupportTicketTable1687586772597 } from './migrations/1687586772597-CreateSupportTicketTable';
import { CreatePermissionsSeed1687739458331 } from './migrations/1687739458331-CreatePermissionsSeed';
import { CreateModuleSeed1687739712850 } from './migrations/1687739712850-CreateModuleSeed';
import { CreatePermissionGroupSeed1687740106609 } from './migrations/1687740106609-CreatePermissionGroupSeed';

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
  CreateContractTable1686317824187,
  CreateInstallmentTypeTable1686441514910,
  CreateInstallmentTable1686447882372,
  CreateServiceStageTable1686949375328,
  CreateCostumerServiceTable1687382298320,
  CreateClientBlackListReasonTable1687568092067,
  CreateClientBlackListTable1687574010200,
  CreateSupportTicketTable1687586772597,
  CreatePermissionsSeed1687739458331,
  CreateModuleSeed1687739712850,
  CreatePermissionGroupSeed1687740106609,
];
