import { Actions, Resources } from "@modules/user/enums";
import { IRoleConfig, Permissions } from "@modules/user/interfaces";

/**
 * Función que obtiene los permisos de administrador para todas
 * las acciones en todos los recursos.
 *
 * @returns {Permissions} Un objeto con todos los recursos asignados a
 * todas las acciones (CREATE, DELETE, READ, UPDATE).
 */
const getAdminPermissions = (): Permissions => {
  const actions = [
    Actions.CREATE,
    Actions.DELETE,
    Actions.READ,
    Actions.UPDATE,
  ];
  const permissions = Object.keys(Resources).reduce((acc, resource) => {
    return { ...acc, [resource]: actions };
  }, {});
  return permissions as Permissions;
};

/**
 * Configuración de roles y permisos para la aplicación.
 *
 * Cada rol tiene un conjunto de permisos específicos sobre los recursos y acciones.
 */
export const RoleConfig: IRoleConfig = {
  /**
   * Permisos para el rol de administrador.
   * El administrador tiene acceso completo (todas las acciones) a todos los recursos.
   */
  admin: {
    permissions: getAdminPermissions(),
  },

  /**
   * Permisos para el rol de gerente de comedor.
   */
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
      [Resources.ORDER]: [
        Actions.READ,
        Actions.UPDATE,
        Actions.CREATE,
        Actions.DELETE,
      ],
      [Resources.PRODUCT]: [Actions.READ],
      [Resources.PROVIDER]: [Actions.READ],
    },
  },

  /**
   * Permisos para el rol de gerente de almacén.
   */
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

  /**
   * Permisos para el rol de contador.
   */
  accountant: {
    permissions: {
      [Resources.BRANCH]: [Actions.READ],
      [Resources.BRAND]: [Actions.READ],
      [Resources.CATEGORY]: [],
      [Resources.INVOICE]: [Actions.READ],
      [Resources.ORDER_ITEM]: [],
      [Resources.ORDER]: [],
      [Resources.PRODUCT]: [Actions.READ],
      [Resources.PROVIDER]: [Actions.READ],
    },
  },

  /**
   * Permisos para el rol de empleado.
   * Los empleados no tienen permisos para acceder a recursos o realizar acciones.
   */
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
};
