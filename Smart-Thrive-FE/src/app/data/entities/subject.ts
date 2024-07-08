import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { Category } from "./category";
import { Course } from "./course";

export interface Subject extends BaseEntity {
    subjectName: string;
    categoryId?: Guid;
    category?: Category;
    courses?: Course[];
}