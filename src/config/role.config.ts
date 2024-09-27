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
      [Resources.PRODUCT]: [],
      [Resources.PRODUCT_PRICE]: [],
      [Resources.CATEGORY]: [],
      [Resources.BRANCH]: [],
      [Resources.INVOICE]: [],
      [Resources.PROVIDER]: [],
      [Resources.ORDER]: [],
    },
  },
  warehouse_manager: {
    permissions: {
      [Resources.PRODUCT]: [],
      [Resources.PRODUCT_PRICE]: [],
      [Resources.CATEGORY]: [],
      [Resources.BRANCH]: [],
      [Resources.INVOICE]: [],
      [Resources.PROVIDER]: [],
      [Resources.ORDER]: [],
    },
  },
  accountant: {
    permissions: {
      [Resources.PRODUCT]: [],
      [Resources.PRODUCT_PRICE]: [],
      [Resources.CATEGORY]: [],
      [Resources.BRANCH]: [],
      [Resources.INVOICE]: [],
      [Resources.PROVIDER]: [],
      [Resources.ORDER]: [],
    },
  },
  employee: {
    permissions: {
      [Resources.PRODUCT]: [],
      [Resources.PRODUCT_PRICE]: [],
      [Resources.CATEGORY]: [],
      [Resources.BRANCH]: [],
      [Resources.INVOICE]: [],
      [Resources.PROVIDER]: [],
      [Resources.ORDER]: [],
    },
  },
}
