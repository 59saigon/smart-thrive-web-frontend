import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { Course } from "./course";
import { User } from "./user";

export interface Provider extends BaseEntity {
    userId: Guid;
    companyName: string;
    website: string;
    user?: User;
    courses?: Course[];
}