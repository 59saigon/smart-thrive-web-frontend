import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { Course } from "./course";
import { Package } from "./package";

export interface CourseXPackage extends BaseEntity {
    courseId: Guid;
    packageId: Guid;
    course?: Course;
    package?: Package;
}