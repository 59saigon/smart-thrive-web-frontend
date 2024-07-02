import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { Event } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Provider } from '../../../../../data/entities/provider';
import { PaginatedRequest } from '../../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../../data/model/paginated-response';
import { ProviderService } from '../../../../services/services/provider.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProviderComponent implements OnInit {
  
  constructor(private providerService: ProviderService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getListProvider();
    this.getSelectedColumns();
  }

  providerDialog: boolean = false;

  deleteProviderDialog: boolean = false;

  deleteProvidersDialog: boolean = false;

  providers: Provider[] = [];

  provider: Provider = {} as Provider;

  selectedProviders: Provider[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  rowsPerPageOptions = [5, 10, 20, 50];

  showDetails = false;

  statuses: any[] = [];

  _selectedColumns: any[] = [];

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  paginatedRequest: PaginatedRequest = {
    pageNumber: 1,
    pageSize: 5,
    sortField: 'CreatedDate',
    sortOrder: 1
  };
  paginatedListResponse: PaginatedListResponse<Provider> = {} as PaginatedListResponse<Provider>;
  getListProvider(): void {
    this.providerService.getAll(this.paginatedRequest).subscribe({
      next: (response) => {
        this.paginatedListResponse = response;
        this.setPaginatedRequest();
      },
      error: (err) => {
        console.log("check_error", err);
      },
    });
  }
  getSelectedColumns() {
    this.cols = headerList;
    this._selectedColumns = this.cols.filter((col) => !col.isDisabled);
  }

  loadPatientListing(event: any) {
    this.paginatedRequest.pageSize = event.rows;
    this.paginatedRequest.pageNumber = event.first/event.rows + 1;
    this.paginatedRequest.sortField = event.sortField;
    this.paginatedRequest.sortOrder = event.sortOrder;

    this.getListProvider();
  }

  setPaginatedRequest() {
    this.paginatedRequest.pageNumber = this.paginatedListResponse.pageNumber;
    this.paginatedRequest.pageSize = this.paginatedListResponse.pageSize;
    this.paginatedRequest.sortField = this.paginatedListResponse.sortField;
  }

  getNewQuote() {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Copied'});
  }

  openNew() {

  }

  deleteSelectedProviders() {
  }

  deleteProvider(provider: Provider) {
  }

  confirmDelete() {

  }

  confirmDeleteSelected() {

  }

  editProvider(provider: Provider) {
  }

  saveProvider() {

  }

  hideDialog() {

  }

  navigateAfterSelected(provider: Provider) {

  }

  onGlobalFilter(table: Table, event: Event) {

  }
}
