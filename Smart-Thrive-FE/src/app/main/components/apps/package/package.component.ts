import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Console } from 'console';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { Event } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Package } from '../../../../data/entities/package';
import { PaginatedRequest } from '../../../../data/model/paginated-request';
import { PaginatedListResponse } from '../../../../data/model/paginated-response';
import { PackageService } from '../../../services/services/package.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PackageComponent implements OnInit {
  
  constructor(private packageService: PackageService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getListPackage();
    this.getSelectedColumns();
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

  showDetails = false;

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
    sortOrder: 1
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
    this.paginatedRequest.pageNumber = event.first/event.rows + 1;
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
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Copied'});
  }

  openNew() {

  }

  deleteSelectedPackages() {
  }

  deletePackage(pack: Package) {
  }

  confirmDelete() {

  }

  confirmDeleteSelected() {

  }

  editPackage(pack: Package) {
  }

  savePackage() {

  }

  hideDialog() {

  }

  navigateAfterSelected(pack: Package) {

  }

  onGlobalFilter(table: Table, event: Event) {

  }
}
