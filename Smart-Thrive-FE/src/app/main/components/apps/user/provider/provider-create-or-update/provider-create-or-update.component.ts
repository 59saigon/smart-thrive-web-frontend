import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderComponent } from '../provider.component';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Provider } from '../../../../../../data/entities/provider';
import { ProviderService } from '../../../../../services/services/provider.service';
import { User } from '../../../../../../data/entities/user';
import { UserService } from '../../../../../services/services/user.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-provider-create-or-update',
  templateUrl: './provider-create-or-update.component.html',
  styleUrl: './provider-create-or-update.component.scss'
})
export class ProviderCreateOrUpdateComponent implements OnInit {

  provider: Provider = {} as Provider;
  user: User = {} as User;
  genderOther!: string;
  selectedGender!: string;
  confirmPassword!: string;

  providerDialog: boolean = false;
  submitted: boolean = false;

  items!: SelectItem[];
  selectedItem!: SelectItem;
  users: User[] = [];

  constructor(private providerService: ProviderService,
    private messageService: MessageService,
    private confirm: ConfirmationService,
    private userService: UserService
  ) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();

    this.userService.getAll().subscribe({
      next: (response) => {
        this.users = response.results;
        this.items = [];
        for (let i = 0; i < this.users.length; i++) {
          this.items.push({ label: this.users[i].email, value: this.users[i].id });
        }
      },
      error: (err) => {
        console.log("check_error", err);
      }
    });
  }

  setTitleAndInformation() {
    if (this.provider.id == null) {
      this.title = "New provider";
      this.information = "Create new information provider."
      this.selectedGender = 'Female';
    } else {
      this.title = "Details provider";
      this.information = "Update new information provider."
      this.selectedItem = {} as SelectItem;
      this.selectedItem.value = this.user.id;
      this.selectedItem.label = this.user?.email;
      console.log(this.user.id);
    }

  }

  getUserById(userId: Guid): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getById(userId).subscribe({
        next: (response) => {
          this.user = response.result;
          console.log(this.user);
          this.items = [];
          for (let i = 0; i < this.users.length; i++) {
            this.items.push({ label: this.users[i].email, value: this.users[i].id });
          }
          resolve();
        },
        error: (err) => {
          console.log("check_error", err);
          reject(err);
        }
      });
    });
  }

  openNew() {
    this.provider = {} as Provider;
    this.selectedItem = {} as SelectItem;
    this.selectedGender = 'Female';
    this.providerDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.providerDialog = false;
    this.submitted = false;
  }

  editProvider() {
    this.providerDialog = true;
    this.submitted = false;
  }

  saveProvider() {
    this.submitted = true;

    this.provider.userId = this.selectedItem.value;

    if (this.provider.id != null) {
      this.providerService.update(this.provider).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.providerService.triggerRefresh();

        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    } else {
      this.providerService.add(this.provider).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.providerService.triggerRefresh();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    }

    this.providerDialog = false;
  }
}


