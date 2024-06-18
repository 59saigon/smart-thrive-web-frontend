import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AppConstantsService } from '../../../layout/services/app.constants.service';
import { AppConstants } from '../../../shared/app-constants';

@Injectable({
  providedIn: 'root',
})
//example: https://localhost:7099/api/object/get-object-list
export class BaseService<T> {
  // constructor(
  //     public http: HttpClient,
  //     public inject: Injector,
  //     public appConstantsService: AppConstantsService,
  //     private messageService: MessageService
  // ) {
  // }
  // openMessageSuccess(content: string) {
  //     this.messageService.add({
  //         severity: 'success',
  //         summary: 'Successful',
  //         detail: content,
  //         life: 3000,
  //     });
  // }
  // openMessageError(content: string) {
  //     this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: content,
  //         life: 3000,
  //     });
  // }
  // openMessageWarn(content: string) {
  //     this.messageService.add({
  //         severity: 'warn',
  //         summary: 'Warn',
  //         detail: content,
  //         life: 3000,
  //     });
  // }
  // getListData(entity: string, data: any): Observable<any> {
  //     return this.http.post(
  //         this.appConstantsService.receiveInstanceAPI(
  //             entity,
  //             AppConstants.GET_LIST
  //         ),
  //         data
  //     );
  // }
  // getByValueData(
  //     entity: string,
  //     data: any,
  //     valueGetBy: string
  // ): Observable<any> {
  //     return this.http.post(
  //         this.appConstantsService.receiveInstanceAPI(
  //             entity,
  //             AppConstants.GET_BY,
  //             valueGetBy
  //         ),
  //         data
  //     );
  // }
  // postData(entity: string, data: any): Observable<any> {
  //     return this.http.post(
  //         this.appConstantsService.receiveInstanceAPI(entity, AppConstants.CREATE),
  //         data
  //     );
  // }
  // putData(entity: string, data: any): Observable<any> {
  //     return this.http.post(
  //         this.appConstantsService.receiveInstanceAPI(entity, AppConstants.UPDATE),
  //         data
  //     );
  // }
  // deleteData(entity: string, data: any): Observable<any> {
  //     return this.http.post(
  //         this.appConstantsService.receiveInstanceAPI(entity, AppConstants.DELETE),
  //         data
  //     );
  // }
  // onLogin(entity: string, data: any): Observable<any> {
  //     return this.http.post(
  //         this.appConstantsService.receiveInstanceAPI(entity, AppConstants.LOGIN),
  //         data
  //     );
  // }
  // onRegister(entity: string, data: any): Observable<any> {
  //     return this.http.post(
  //         this.appConstantsService.receiveInstanceAPI(
  //             entity,
  //             AppConstants.REGISTER
  //         ),
  //         data
  //     );
  // }
  //fhsdjfyahfabfòabalfgsabfkbfjbfkàgakjgòalsbflg
}
