import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { Role } from "./role";
import { Student } from "./student";
import { Provider } from "./provider";

export interface User extends BaseEntity {
  firstName: string; // Required field, not nullable
  lastName: string; // Required field, not nullable
  fullName: string; // Required field, not nullable
  picture?: string; // Required field, not nullable
  email?: string; // Nullable
  dob: Date; // Required field
  address?: string; // Nullable
  gender?: string; // Nullable
  phone?: string; // Required field, not nullable
  username: string; // Required field, not nullable
  password?: string; // Required field, not nullable
  roleId?: Guid; // RoleId as a UUID/GUID, could be a string in TypeScript
  avatar?: string; // Nullable
  status?: string; // Nullable
  role?: Role; 
  provider?: Provider;
  students?: Student[];
}
