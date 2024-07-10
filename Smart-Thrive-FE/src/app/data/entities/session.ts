import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { Course } from "./course";

export interface Session extends BaseEntity {
    courseId: Guid;
    sessionName: string;
    title?: string;
    description?: string;
    learnDate?: Date;
    course?: Course;
}