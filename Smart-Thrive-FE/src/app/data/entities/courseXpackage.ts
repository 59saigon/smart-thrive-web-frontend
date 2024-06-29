import { BaseEntity } from "./baseEntity";
import { Course } from "./course";
import { Package } from "./package";

export interface CourseXPackage extends BaseEntity {
    courseId: string;
    packageId: string;
    course?: Course;
    package?: Package;
}