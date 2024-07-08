import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Provider } from '../../../../../../data/entities/provider';
import { PaginatedRequest } from '../../../../../../data/model/paginated-request';
import { User } from '../../../../../../data/entities/user';
import { Guid } from 'guid-typescript';
import { UserService } from '../../../../../services/services/user.service';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrl: './provider-detail.component.scss'
})
export class ProviderDetailComponent implements OnInit {
  constructor(private messageService: MessageService, private userService: UserService) { }

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
    this.getUserById(this.provider.userId);
  }

  getUserById(userId: Guid) {
    this.userService.getById(userId).subscribe({
      next: (response) => {
        this.user = response.result;
      },
      error: (err) => {
        console.log("check_error", err);
      }
    });

  }
}
