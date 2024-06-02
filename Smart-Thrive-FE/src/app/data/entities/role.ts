import { BaseEntity } from "./baseEntity";
import { User } from "./user";

export interface Role extends BaseEntity {
  title: string; // Required field, not nullable
  roleName: string; // Required field, not nullable
  users?: User[]; // Optional collection to represent a one-to-many relationship with Users
}
