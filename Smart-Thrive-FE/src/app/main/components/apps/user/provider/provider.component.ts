import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProviderCreateOrUpdateComponent } from './provider-create-or-update/provider-create-or-update.component';
import { ProviderDetailComponent } from './provider-detail/provider-detail.component';
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
  @ViewChild(ProviderCreateOrUpdateComponent) providerCreateOrUpdateComponent!: ProviderCreateOrUpdateComponent;
  @ViewChild(ProviderDetailComponent) providerDetailComponent!: ProviderDetailComponent;

  constructor(
    private providerService: ProviderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialize();
    this.isShowDetail = false;

    this.providerService.refreshComponent$.subscribe(() => {
      this.initialize();
    });
  }

  initialize(): void {
    this.clear();
    this.getListProvider();
    this.getSelectedColumns();
  }

  clear() {
    this.provider = {} as Provider;
    this.providers = [];
    this.selectedProviders = [];
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
  statuses: any[] = [];
  _selectedColumns: any[] = [];
  activeState: boolean[] = [true, false, false];

  toggle(index: number) {
    this.activeState[index] = !this.activeState[index];
  }

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
    sortOrder: -1
  };

  paginatedListResponse: PaginatedListResponse<Provider> = {} as PaginatedListResponse<Provider>;
  getListProvider(): void {
    this.providerService.getAllPagination(this.paginatedRequest).subscribe({
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
    this.paginatedRequest.pageNumber = event.first / event.rows + 1;
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
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  deleteSelectedProviders() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected providers?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //call api

        this.selectedProviders.forEach((m) => {
          this.providerService.delete(m.id).subscribe({
            next: (response) => {
              this.ngOnInit();
            },
            error: (err) => {
            },
          });
        });

        this.selectedProviders = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Providers Deleted', life: 3000 });
      }
    });
  }

  deleteProvider(provider: Provider) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + provider.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.providerService.delete(provider.id).subscribe({
          next: (response) => {
            this.ngOnInit();
          },
          error: (err) => {
          },
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Provider Deleted', life: 3000 });
      }
    });
  }

  editProvider(provider: Provider) {
    this.providerCreateOrUpdateComponent.provider = provider;
    this.providerCreateOrUpdateComponent.getUserById(provider.userId).then(() => {
      this.providerCreateOrUpdateComponent.ngOnInit();
      this.providerCreateOrUpdateComponent.editProvider();
    });
  }

  isShowDetail: boolean = false;
  navigateAfterSelected(provider: Provider) {
    this.activeState[1] = true;
    this.isShowDetail = true;
    this.providerDetailComponent.provider = provider;
    this.providerDetailComponent.ngOnInit();
  }

  onGlobalFilter(table: Table, event: Event) { }
}