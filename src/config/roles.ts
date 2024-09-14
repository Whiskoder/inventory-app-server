export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum Resource {
  CATEGORY = 'category',
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
    },
  },
  manager: {
    permissions: {
      [Resource.CATEGORY]: [],
    },
  },
  warehouseman: {
    permissions: { [Resource.CATEGORY]: [] },
  },
  accountant: {
    permissions: { [Resource.CATEGORY]: [] },
  },
  user: {
    permissions: { [Resource.CATEGORY]: ['create'] },
  },
}
