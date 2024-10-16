import { Roles } from '@/modules/user/enums'

export const USERS = [
  {
    contactPhone: '+523345781934',
    email: 'contador@sistemasdealimentacion.com.mx',
    firstName: 'Sofía Elena',
    lastName: 'Mendoza Pérez',
    password: 'Default123?',
    role: Roles.ACCOUNTANT,
  },
  {
    contactPhone: '+523361247850',
    email: 'admin@sistemasdealimentacion.com.mx',
    firstName: 'Carlos Andrés',
    lastName: 'Ramírez López',
    password: 'Default123?',
    role: Roles.ADMIN,
  },
  {
    contactPhone: '+523384932501',
    email: 'comedor@sistemasdealimentacion.com.mx',
    firstName: 'Ana María',
    lastName: 'López Gonzáles',
    password: 'Default123?',
    role: Roles.BRANCH_MANAGER,
  },
  {
    contactPhone: '+523323569742',
    email: 'almacen@sistemasdealimentacion.com.mx',
    firstName: 'Diego Alejandro',
    lastName: 'Hernández Morales',
    password: 'Default123?',
    role: Roles.WAREHOUSE_MANAGER,
  },
  {
    contactPhone: '+523378126439',
    email: 'empleado@sistemasdealimentacion.com.mx',
    firstName: 'Valeria Fernanda',
    lastName: 'Torres Jiménez',
    password: 'Default123?',
    role: Roles.EMPLOYEE,
  },
]
