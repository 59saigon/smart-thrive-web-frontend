import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Provider } from '../../../../../../data/entities/provider';
import { PaginatedRequest } from '../../../../../../data/model/paginated-request';
import { User } from '../../../../../../data/entities/user';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrl: './provider-detail.component.scss'
})
export class ProviderDetailComponent implements OnInit {
  constructor(private messageService: MessageService) { }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  id: string | null = null;
  provider: Provider = {} as Provider;
  user: User = {} as User;
  dob!: Date;
  genderOther!: string;
  selectedGender!: string;

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };

  ngOnInit(): void {
    //this.user = this.provider.user || {} as User;
  }
}
