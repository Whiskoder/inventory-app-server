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
}

export type Role = 'admin' | 'manager' | 'warehouseman' | 'accountant' | 'user'

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
    },
  },
  manager: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.RESTAURANT]: [],
      [Resource.PRODUCT]: [],
    },
  },
  warehouseman: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.RESTAURANT]: [],
      [Resource.PRODUCT]: [],
    },
  },
  accountant: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.RESTAURANT]: [],
      [Resource.PRODUCT]: [],
    },
  },
  user: {
    permissions: {
      [Resource.CATEGORY]: [],
      [Resource.RESTAURANT]: [],
      [Resource.PRODUCT]: [],
    },
  },
}
