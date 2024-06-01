import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrl: './app.topbar.component.scss',
})
export class AppTopbarComponent implements OnInit {
  
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService) {}
  ngOnInit(): void {}
}