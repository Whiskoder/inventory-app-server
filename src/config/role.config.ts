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
      [Resources.BRANCH]: [Actions.READ],
      [Resources.BRAND]: [Actions.READ],
      [Resources.CATEGORY]: [Actions.READ],
      [Resources.INVOICE]: [],
      [Resources.ORDER_ITEM]: [
        Actions.READ,
        Actions.UPDATE,
        Actions.CREATE,
        Actions.DELETE,
      ],
      [Resources.ORDER]: [Actions.READ, Actions.UPDATE, Actions.CREATE],
      [Resources.PRODUCT]: [Actions.READ],
      [Resources.PROVIDER]: [Actions.READ],
    },
  },
  warehouse_manager: {
    permissions: {
      [Resources.BRANCH]: [Actions.READ],
      [Resources.BRAND]: [Actions.CREATE, Actions.READ, Actions.UPDATE],
      [Resources.CATEGORY]: [Actions.CREATE, Actions.READ, Actions.UPDATE],
      [Resources.INVOICE]: [Actions.CREATE, Actions.READ, Actions.UPDATE],
      [Resources.ORDER_ITEM]: [Actions.READ],
      [Resources.ORDER]: [Actions.READ, Actions.UPDATE],
      [Resources.PRODUCT]: [
        Actions.CREATE,
        Actions.READ,
        Actions.UPDATE,
        Actions.DELETE,
      ],
      [Resources.PROVIDER]: [Actions.READ, Actions.UPDATE, Actions.CREATE],
    },
  },
  accountant: {
    permissions: {
      [Resources.BRANCH]: [],
      [Resources.BRAND]: [],
      [Resources.CATEGORY]: [],
      [Resources.INVOICE]: [Actions.READ],
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
