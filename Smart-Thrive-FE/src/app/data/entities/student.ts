import { User } from './user'; // Assuming User is defined in a separate file
import { Package } from './package'; // Assuming Package is defined in a separate file
import { BaseEntity } from './baseEntity';
import { Guid } from 'guid-typescript';

export interface Student extends BaseEntity {
    userId?: Guid; // Assuming Guid is represented as string in TypeScript
    studentName?: string;
    gender?: string;
    dob?: Date;
    user?: User;
    packages?: Package[];
}
