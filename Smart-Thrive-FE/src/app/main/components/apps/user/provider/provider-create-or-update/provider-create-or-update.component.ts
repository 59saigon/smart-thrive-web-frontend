import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderComponent } from '../provider.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Provider } from '../../../../../../data/entities/provider';
import { ProviderService } from '../../../../../services/services/provider.service';
import { User } from '../../../../../../data/entities/user';

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



  constructor(private providerService: ProviderService, private messageService: MessageService, private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();
  }

  setTitleAndInformation() {
    if (this.provider.id == null) {
      this.title = "New provider";
      this.information = "Create new information provider."
      this.selectedGender = 'Female';
    } else {
      this.title = "Details provider";
      this.information = "Update new information provider."
    }

  }

  openNew() {
    this.provider = {} as Provider;
    this.providerDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.providerDialog = false;
    this.submitted = false;
  }

  editProvider(provider: Provider) {
    this.provider = { ...provider };
    this.providerDialog = true;
    this.submitted = false;
  }

  saveProvider() {
    this.submitted = true;

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


