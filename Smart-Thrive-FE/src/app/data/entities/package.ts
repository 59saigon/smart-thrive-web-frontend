import { BaseEntity } from "./baseEntity";

export interface Package extends BaseEntity {
    studentId?: string; // Assuming Guid is represented as string in TypeScript

    packageName: string;

    startDate?: Date;

    endDate?: Date;

    quantityCourse?: number;

    totalPrice: number;

    isActive?: boolean;

    // student?: StudentModel;

    // courseXPackages?: CourseXPackage[];

    // orders?: OrderModel[];
  }