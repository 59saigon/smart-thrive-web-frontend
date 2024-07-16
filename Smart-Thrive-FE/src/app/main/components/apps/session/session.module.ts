import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { SessionComponent } from './session.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { SessionCreateOrUpdateComponent } from './session-create-or-update/session-create-or-update.component';
import { SessionDetailComponent } from './session-detail/session-detail.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@NgModule({
  declarations: [
    SessionComponent,
    SessionCreateOrUpdateComponent,
    SessionDetailComponent
  ],
  imports: [
    CommonModule,
    SessionRoutingModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    CalendarModule,
    ToastModule,
    PanelModule,
    PanelMenuModule,
    TooltipModule,
    MultiSelectModule,
    ClipboardModule,
    AccordionModule,
    ConfirmDialogModule
  ],
  exports: [
    SessionCreateOrUpdateComponent // export it for use in other modules
  ]
})
export class SessionModule { }
