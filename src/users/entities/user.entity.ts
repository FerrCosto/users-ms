import { Roles } from '@prisma/client';

export interface Direccion {
  city: string;
  zip: string;
  address: string;
  address2?: string | null;
}

export interface User {
  fullName: string;
  email: string;
  telefono?: string | null;
  role: Roles;
  direccion?: Direccion;
  creadoEn: Date;
  editadoEn?: Date;
}
