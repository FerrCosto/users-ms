import { Roles } from '@prisma/client';

export interface User {
  id: string;
  fullName: string;
  email: string;
  telefono?: string | null;
  role: Roles;
  creadoEn?: Date;
  editadoEn?: Date;
}
