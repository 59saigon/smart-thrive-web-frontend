import { BaseEntity } from "./baseEntity";
import { Course } from "./course";

export interface Session extends BaseEntity {
    courseId: string;
    sessionName: string;
    title?: string;
    description?: string;
    learnDate?: Date;
    course?: Course;
}