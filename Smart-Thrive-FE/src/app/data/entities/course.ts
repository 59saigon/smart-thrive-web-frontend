import { BaseEntity } from "./baseEntity";
import { CourseXPackage } from "./courseXpackage";
import { Location } from "./location";
import { Provider } from "./provider";
import { Session } from "./session";
import { Subject } from "./subject";

export interface Course extends BaseEntity {
    subjectId?: string;
    providerId?: string;
    locationId?: string;
    code?: string;
    courseName?: string;
    description?: string;
    price?: number;
    quantity?: number;
    soldProduct?: number;
    totalSlot?: number;
    isApproved?: boolean;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    location?: Location;
    subject?: Subject;
    provider?: Provider;
    sessions?: Session[];
    courseXPackages?: CourseXPackage[];
  }