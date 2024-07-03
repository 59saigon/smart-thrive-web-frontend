import { BaseEntity } from "./baseEntity";
import { Location } from "./location";
import { Role } from "./role";

export interface User extends BaseEntity {
  fullName: string; // Required field, not nullable
  email?: string; // Nullable
  dob: Date; // Required field
  address?: string; // Nullable
  gender?: string; // Nullable
  phone: string; // Required field, not nullable
  username: string; // Required field, not nullable
  password: string; // Required field, not nullable
  roleID: string; // RoleId as a UUID/GUID, could be a string in TypeScript
  locationID: string;
  avatar?: string; // Nullable
  status?: string; // Nullable
  role: Role; 
  location?: Location;
}
