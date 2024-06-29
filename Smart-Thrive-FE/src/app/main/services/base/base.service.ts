import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { AppConstantsService } from '../../../layout/services/app.constants.service';
import { AppConstants } from '../../../shared/app-constants';
import { BaseResponse } from '../../../data/model/base-response';
import { ConstantsApi } from '../../../shared/constants/constants-api';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root',
})
//example: https://localhost:7099/api/object/get-object-list
export class BaseService<T> {
  
}
