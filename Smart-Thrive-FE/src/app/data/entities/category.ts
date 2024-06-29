import { BaseEntity } from "./baseEntity";
import { Subject } from "./subject";

export interface Category extends BaseEntity {
    categoryName: string;
    subjects?: Subject[];
}