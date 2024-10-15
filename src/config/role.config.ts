import { Actions, Resources } from '@modules/user/enums'
import { IRoleConfig, Permissions } from '@modules/user/interfaces'

const getAdminPermissions = (): Permissions => {
  const actions = [Actions.CREATE, Actions.DELETE, Actions.READ, Actions.UPDATE]
  const permissions = Object.keys(Resources).reduce((acc, resource) => {
    return { ...acc, [resource]: actions }
  }, {})
  return permissions as Permissions
}

export const RoleConfig: IRoleConfig = {
  admin: {
    permissions: getAdminPermissions(),
  },
  branch_manager: {
    permissions: {
      [Resources.BRANCH]: [],
      [Resources.BRAND]: [],
      [Resources.CATEGORY]: [],
      [Resources.INVOICE]: [],
      [Resources.ORDER_ITEM]: [],
      [Resources.ORDER]: [],
      [Resources.PRODUCT]: [],
      [Resources.PROVIDER]: [],
    },
  },
  warehouse_manager: {
    permissions: {
      [Resources.BRANCH]: [],
      [Resources.BRAND]: [Actions.CREATE, Actions.READ, Actions.UPDATE],
      [Resources.CATEGORY]: [Actions.CREATE, Actions.READ, Actions.UPDATE],
      [Resources.INVOICE]: [],
      [Resources.ORDER_ITEM]: [],
      [Resources.ORDER]: [],
      [Resources.PRODUCT]: [
        Actions.CREATE,
        Actions.READ,
        Actions.UPDATE,
        Actions.DELETE,
      ],
      [Resources.PROVIDER]: [],
    },
  },
  accountant: {
    permissions: {
      [Resources.BRANCH]: [],
      [Resources.BRAND]: [],
      [Resources.CATEGORY]: [],
      [Resources.INVOICE]: [],
      [Resources.ORDER_ITEM]: [],
      [Resources.ORDER]: [],
      [Resources.PRODUCT]: [],
      [Resources.PROVIDER]: [],
    },
  },
  employee: {
    permissions: {
      [Resources.BRANCH]: [],
      [Resources.BRAND]: [],
      [Resources.CATEGORY]: [],
      [Resources.INVOICE]: [],
      [Resources.ORDER_ITEM]: [],
      [Resources.ORDER]: [],
      [Resources.PRODUCT]: [],
      [Resources.PROVIDER]: [],
    },
  },
}
