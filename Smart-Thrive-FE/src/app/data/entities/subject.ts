import { BaseEntity } from "./baseEntity";
import { Category } from "./category";
import { Course } from "./course";

export interface Subject extends BaseEntity {
    subjectName: string;
    categoryId?: string;
    category?: Category;
    courses?: Course[];
}