import { Injectable } from '@angular/core';
import { AppConstants } from '../../../shared/appConstants';

@Injectable({
    providedIn: 'root',
})
export class AppConstantsService {
    constructor() { }

    private setInstanceAPI(entity: string, rest: string): string {
        var apiLink = `${AppConstants.BASE_URL}/api/${entity}/${rest}-${entity}`;
        return apiLink;
    }

    private setInstanceByAPI(entity: string, rest: string): string {
        var apiLink = `${AppConstants.BASE_URL}/api/${entity}/${rest}`;
        return apiLink;
    }

    private setInstanceNoUnderlineAPI(entity: string, rest: string): string {
        var apiLink = `${AppConstants.BASE_URL}/api/${entity}/${rest}`;
        return apiLink;
    }

    receiveInstanceAPI(
        entity: string,
        rest: string,
        valueGetBy?: string
    ): string {
        switch (rest) {
            case AppConstants.GET_LIST:
                return this.getInstanceAPIList(entity, rest);
                break;
            case AppConstants.GET_BY:
                return this.getInstanceAPIBy(entity, rest, valueGetBy);
                break;
            case AppConstants.LOGIN || AppConstants.REGISTER:
                return this.getInstanceAPINoUnderline(entity, rest);
                break;
            default:
                return this.getInstanceAPI(entity, rest);
                break;
        }
    }

    private getInstanceAPIList(entity: string, rest: string): string {
        return `${this.setInstanceAPI(entity, rest)}-list`;
    }

    private getInstanceAPIBy(
        entity: string,
        rest: string,
        valueGetBy?: string
    ): string {
        return `${this.setInstanceByAPI(entity, rest)}-${valueGetBy}`;
    }

    private getInstanceAPI(entity: string, rest: string): string {
        return this.setInstanceAPI(entity, rest);
    }

    private getInstanceAPINoUnderline(entity: string, rest: string): string {
        return this.setInstanceNoUnderlineAPI(entity, rest);
    }
}
