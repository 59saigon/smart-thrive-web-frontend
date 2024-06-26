import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import headerList from './headerList';
import { Table } from 'primeng/table';
import { Package } from '../../../../../data/entities/package';
import { PackageService } from '../../../../services/user/package.service';

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrl: './package.component.scss',
})
export class PackageComponent implements OnInit {
  
  constructor(private packageService: PackageService) { }

  ngOnInit(): void {
    this.getListPackage();
    this.getSelectedColumns();
  }

  id: string = '';

  packageDialog: boolean = false;

  deletePackageDialog: boolean = false;

  deletePackagesDialog: boolean = false;

  packages: Package[] = [];

  _package: Package = {} as Package;

  location: Location = {} as Location;

  selectedPackages: Package[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  showDetails = false;

  statuses: any[] = [];

  _selectedColumns: any[] = [];

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  getListPackage(): void {
    // this.packageService.getAllPackage().subscribe({
    //   next: (response) => {
    //     console.log("check_", response.results);
    //     this.packages = response.results;
    //   },
    //   error: (err) => {
    //   },
    // });
  }
  getSelectedColumns() {
    this.cols = headerList;
    this._selectedColumns = this.cols.filter((col) => !col.isDisabled);
  }

  openNew() {

  }

  deleteSelectedPackages() {
  }

  deletePackage(_package: Package) {
  }

  confirmDelete() {

  }

  confirmDeleteSelected() {

  }

  editPackage(_package: Package) {
  }

  savePackage() {

  }

  hideDialog() {

  }

  navigateAfterSelected(_package: Package) {

  }

  onGlobalFilter(table: Table, event: Event) {

  }
}
