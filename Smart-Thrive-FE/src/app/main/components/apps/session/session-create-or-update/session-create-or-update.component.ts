import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionComponent } from '../session.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Session } from '../../../../../data/entities/session';
import { SessionService } from '../../../../services/services/session.service';
import { Category } from '../../../../../data/entities/category';

@Component({
  selector: 'app-session-create-or-update',
  templateUrl: './session-create-or-update.component.html',
  styleUrl: './session-create-or-update.component.scss'
})
export class SessionCreateOrUpdateComponent implements OnInit {

  session: Session = {} as Session;
  learnDate!: Date;

  sessionDialog: boolean = false;
  submitted: boolean = false;



  constructor(private sessionService: SessionService, private messageService: MessageService, private confirm: ConfirmationService) {

  }

  title!: string;
  information!: string;

  ngOnInit(): void {
    this.setTitleAndInformation();
  }

  setTitleAndInformation() {
    if (this.session.id == null) {
      this.title = "New session";
      this.information = "Create new information session."
    } else {
      this.title = "Details session";
      this.information = "Update new information session."
      this.learnDate = new Date(this.session.learnDate ?? '');
    }

  }

  openNew() {
    this.session = {} as Session;
    this.sessionDialog = true;
    this.submitted = false;
  }

  hideDialog() {
    this.sessionDialog = false;
    this.submitted = false;
  }

  editSession(session: Session) {
    this.session = { ...session };
    this.sessionDialog = true;
    this.submitted = false;
  }

  saveSession() {
    this.submitted = true;

    this.session.learnDate = this.learnDate;

    if (this.session.id != null) {
      this.sessionService.update(this.session).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.sessionService.triggerRefresh();
          
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    } else {
      this.sessionService.add(this.session).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.sessionService.triggerRefresh();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error' });
        },
      });
    }

    this.sessionDialog = false;
  }
}


