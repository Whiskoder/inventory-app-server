import { Actions, Resources, Roles } from '@modules/user/enums'

export type IRoleConfig = {
  [key in Roles]: {
    permissions: Permissions
  }
}

export type Permissions = {
  [key in Resources]: Actions[]
}
