import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PackageCreateOrUpdateComponent } from './package-create-or-update/package-create-or-update.component';
import { PackageDetailComponent } from './package-detail/package-detail.component';
import { PackageService } from '../../../services/services/package.service';
import { Package } from '../../../../data/entities/package';
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PackageComponent implements OnInit {
  @ViewChild(PackageCreateOrUpdateComponent) packageCreateOrUpdateComponent!: PackageCreateOrUpdateComponent;
  @ViewChild(PackageDetailComponent) packageDetailComponent!: PackageDetailComponent;

  constructor(
    private packageService: PackageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initialize();
    this.isShowDetail = false;

    this.packageService.refreshComponent$.subscribe(() => {
      this.initialize();
    });
  }

  initialize(): void {
    this.clear();
    this.getListPackage();
    this.getSelectedColumns();
  }

  clear() {
    this.package = {} as Package;
    this.packages = [];
    this.selectedPackages = [];
  }

  packageDialog: boolean = false;
  deletePackageDialog: boolean = false;
  deletePackagesDialog: boolean = false;

  packages: Package[] = [];
  package: Package = {} as Package;
  selectedPackages: Package[] = [];

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

  paginatedListResponse: PaginatedListResponse<Package> = {} as PaginatedListResponse<Package>;
  getListPackage(): void {
    this.packageService.getAllPagination(this.paginatedRequest).subscribe({
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

    this.getListPackage();
  }

  setPaginatedRequest() {
    this.paginatedRequest.pageNumber = this.paginatedListResponse.pageNumber;
    this.paginatedRequest.pageSize = this.paginatedListResponse.pageSize;
    this.paginatedRequest.sortField = this.paginatedListResponse.sortField;
  }

  getNewQuote() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Copied' });
  }

  deleteSelectedPackages() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected packages?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        //call api

        this.selectedPackages.forEach((m) => {
          this.packageService.delete(m.id).subscribe({
            next: (response) => {
              this.ngOnInit();
            },
            error: (err) => {
            },
          });
        });

        this.selectedPackages = [];
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Packages Deleted', life: 3000 });
      }
    });
  }

  deletePackage(pkg: Package) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + pkg.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.packageService.delete(pkg.id).subscribe({
          next: (response) => {
            this.ngOnInit();
          },
          error: (err) => {
          },
        });
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Package Deleted', life: 3000 });
      }
    });
  }

  editPackage(pkg: Package) {
    this.packageCreateOrUpdateComponent.package = pkg;
    this.packageCreateOrUpdateComponent.ngOnInit();
    this.packageCreateOrUpdateComponent.editPackage();
  }

  isShowDetail: boolean = false;
  navigateAfterSelected(pkg: Package) {
    this.activeState[1] = true;
    this.isShowDetail = true;
    this.packageDetailComponent.package = pkg;
    this.packageDetailComponent.ngOnInit();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal(
      (event.target as HTMLInputElement).value,
      'contains'
    );
  }
}