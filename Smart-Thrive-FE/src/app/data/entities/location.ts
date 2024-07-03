import { BaseEntity } from "./baseEntity";
import { Course } from "./course";
import { User } from "./user";

export interface Location extends BaseEntity {
    city?: string;
    district?: string;
    ward?: string;
    users?: User[];
    courses?: Course[];
  }