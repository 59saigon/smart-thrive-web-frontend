import { Guid } from 'guid-typescript';
import { BaseEntity } from './baseEntity';
import { Package } from './package'; // Assuming Package is defined in a separate file

export interface Order extends BaseEntity{
    packageId: Guid; // Assuming Guid is represented as string in TypeScript
    paymentMethod?: string;
    amount?: number;
    totalPrice?: number; // Assuming decimal is represented as number in TypeScript
    description?: string;
    status?: boolean;
    package?: Package;
}
