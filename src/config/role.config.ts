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
      [Resources.BRAND]: [],
      [Resources.ORDER_ITEM]: [],
    },
  },
  warehouse_manager: {
    permissions: {
      [Resources.BRAND]: [],
      [Resources.PRODUCT]: [],
      [Resources.PRODUCT_PRICE]: [],
      [Resources.CATEGORY]: [],
      [Resources.BRANCH]: [],
      [Resources.INVOICE]: [],
      [Resources.PROVIDER]: [],
      [Resources.ORDER]: [],
      [Resources.ORDER_ITEM]: [],
    },
  },
  accountant: {
    permissions: {
      [Resources.BRAND]: [],
      [Resources.PRODUCT]: [],
      [Resources.PRODUCT_PRICE]: [],
      [Resources.CATEGORY]: [],
      [Resources.BRANCH]: [],
      [Resources.INVOICE]: [],
      [Resources.PROVIDER]: [],
      [Resources.ORDER]: [],
      [Resources.ORDER_ITEM]: [],
    },
  },
  employee: {
    permissions: {
      [Resources.BRAND]: [],
      [Resources.PRODUCT]: [],
      [Resources.PRODUCT_PRICE]: [],
      [Resources.CATEGORY]: [],
      [Resources.BRANCH]: [],
      [Resources.INVOICE]: [],
      [Resources.PROVIDER]: [],
      [Resources.ORDER]: [],
      [Resources.ORDER_ITEM]: [],
    },
  },
}
