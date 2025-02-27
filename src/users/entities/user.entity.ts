import { Roles } from '@prisma/client';

export interface Direccion {
  city: string;
  address: string;
  address2?: string | null;
  zip: string;
}
export interface User {
  id: string;
  fullName: string;
  email: string;
  telefono?: string | null;
  role: Roles;
  direccion?: Direccion | null;
  creadoEn?: Date;
  editadoEn?: Date;
}
