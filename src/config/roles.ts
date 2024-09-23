export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Resource {
  CATEGORY = 'category',
  BRANCH = 'branch',
  PRODUCT = 'product',
  PROVIDER = 'provider',
  ORDER = 'order',
}

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  WAREHOUSEMAN = 'warehouseman',
  ACCOUNTANT = 'accountant',
  EMPLOYEE = 'employee',
}

type IRoleConfig = {
  [key in Role]: {
    permissions: {
      [key in Resource]: string[]
    }
  }
}

export const RoleConfig: IRoleConfig = {
  admin: {
    permissions: {
      [Resource.CATEGORY]: ['create', 'read', 'update', 'delete'],
      [Resource.BRANCH]: ['create', 'read', 'update', 'delete'],
      [Resource.PRODUCT]: ['create', 'read', 'update', 'delete'],
      [Resource.PROVIDER]: ['create', 'read', 'update', 'delete'],
      [Resource.ORDER]: ['create', 'read', 'update', 'delete'],
    },
  },
  manager: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.BRANCH]: [],
      [Resource.PRODUCT]: [],
      [Resource.PROVIDER]: [],
      [Resource.ORDER]: [],
    },
  },
  warehouseman: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.BRANCH]: [],
      [Resource.PRODUCT]: [],
      [Resource.PROVIDER]: [],
      [Resource.ORDER]: [],
    },
  },
  accountant: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.BRANCH]: [],
      [Resource.PRODUCT]: [],
      [Resource.PROVIDER]: [],
      [Resource.ORDER]: [],
    },
  },
  employee: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.BRANCH]: [],
      [Resource.PRODUCT]: [],
      [Resource.PROVIDER]: [],
      [Resource.ORDER]: [],
    },
  },
}
