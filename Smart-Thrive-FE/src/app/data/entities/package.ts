import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { CourseXPackage } from "./courseXpackage";
import { Student } from "./student";

export interface Package extends BaseEntity {
    studentId?: Guid; // Assuming Guid is represented as string in TypeScript

    packageName: string;

    startDate?: Date;

    endDate?: Date;

    quantityCourse?: number;

    totalPrice: number;

    isActive?: boolean;

    student?: Student;

    courseXPackages?: CourseXPackage[];

  }