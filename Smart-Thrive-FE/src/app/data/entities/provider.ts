import { BaseEntity } from "./baseEntity";
import { Course } from "./course";
import { User } from "./user";

export interface Provider extends BaseEntity {
    userId: string;
    companyName: string;
    website: string;
    user?: User;
    courses?: Course[];
}