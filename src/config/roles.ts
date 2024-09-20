export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Resource {
  CATEGORY = 'category',
  RESTAURANT = 'restaurant',
  PRODUCT = 'product',
  PROVIDER = 'provider',
  ORDER = 'order',
}

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  WAREHOUSEMAN = 'warehouseman',
  ACCOUNTANT = 'accountant',
  USER = 'user',
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
      [Resource.RESTAURANT]: ['create', 'read', 'update', 'delete'],
      [Resource.PRODUCT]: ['create', 'read', 'update', 'delete'],
      [Resource.PROVIDER]: ['create', 'read', 'update', 'delete'],
      [Resource.ORDER]: ['create', 'read', 'update', 'delete'],
    },
  },
  manager: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.RESTAURANT]: [],
      [Resource.PRODUCT]: [],
      [Resource.PROVIDER]: [],
      [Resource.ORDER]: [],
    },
  },
  warehouseman: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.RESTAURANT]: [],
      [Resource.PRODUCT]: [],
      [Resource.PROVIDER]: [],
      [Resource.ORDER]: [],
    },
  },
  accountant: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.RESTAURANT]: [],
      [Resource.PRODUCT]: [],
      [Resource.PROVIDER]: [],
      [Resource.ORDER]: [],
    },
  },
  user: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.RESTAURANT]: [],
      [Resource.PRODUCT]: [],
      [Resource.PROVIDER]: [],
      [Resource.ORDER]: [],
    },
  },
}
