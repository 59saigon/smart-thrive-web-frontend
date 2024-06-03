import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../services/app.layout/app.layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrl: './app.topbar.component.scss',
})
export class AppTopbarComponent implements OnInit {
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  isMenuOpen = this.layoutService.isDesktop(); // Bắt đầu với trạng thái mặc định

  constructor(public layoutService: LayoutService) {}
  
  ngOnInit(): void {
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.layoutService.onMenuToggle();
  }
}