import { Guid } from "guid-typescript";
import { BaseEntity } from "./baseEntity";
import { CourseXPackage } from "./courseXpackage";
import { Provider } from "./provider";
import { Session } from "./session";
import { Subject } from "./subject";

export interface Course extends BaseEntity {
    subjectId?: Guid;
    providerId?: Guid;
    address?: string;
    code?: string;
    courseName?: string;
    description?: string;
    price?: number;
    totalSessions?: number;
    soldCourses?: number;
    totalSlots?: number;
    status?: string;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    subject?: Subject;
    provider?: Provider;
    sessions?: Session[];
    courseXPackages?: CourseXPackage[];
  }