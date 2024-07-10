import { Component, Input } from '@angular/core';
import { LayoutService } from '../../services/app.layout/app.layout.service';
import { MenuService } from '../../services/app.menu/app.menu.service';
import { ConstantsTheme } from '../../../shared/constants/constant-theme';

@Component({
  selector: 'app-config',
  templateUrl: './app-config.component.html',
  styleUrl: './app-config.component.scss',
})
export class AppConfigComponent {
  @Input() minimal: boolean = false;

  stateOptions: any[] = [];

  scales: number[] = [12, 13, 14, 15, 16];

  constructor(
    public layoutService: LayoutService,
    public menuService: MenuService
  ) {
    this.stateOptions = [{label: 'Outlined', value: 'outlined'}, {label: 'Filled', value: 'filled'}];
    this.changeTheme(ConstantsTheme.default, '')
    this.ripple = true;
  }

  get visible(): boolean {
    return this.layoutService.state.configSidebarVisible;
  }
  set visible(_val: boolean) {
    this.layoutService.state.configSidebarVisible = _val;
  }

  get scale(): number {
    return this.layoutService.config().scale;
  }
  set scale(_val: number) {
    this.layoutService.config.update((config) => ({
      ...config,
      scale: _val,
    }));
  }

  get menuMode(): string {
    return this.layoutService.config().menuMode;
  }
  set menuMode(_val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      menuMode: _val,
    }));
  }

  get inputStyle(): string {
    return this.layoutService.config().inputStyle;
  }
  set inputStyle(_val: string) {
    this.layoutService.config().inputStyle = _val;
  }

  get ripple(): boolean {
    return this.layoutService.config().ripple;
  }
  set ripple(_val: boolean) {
    this.layoutService.config.update((config) => ({
      ...config,
      ripple: _val,
    }));
  }

  get mode(): boolean {
    var IsMode = this.layoutService.config().theme != ConstantsTheme.light ? true : false;

    return IsMode;
  }
  set mode(_val: boolean) {
    
      this.layoutService.config.update((config) => ({
        ...config,
        theme: _val ? ConstantsTheme.dark : ConstantsTheme.light,
      }));
    
  }

  set theme(val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      theme: val,
    }));
  }
  get theme(): string {
    return this.layoutService.config().theme;
  }

  set colorScheme(val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      colorScheme: val,
    }));
  }
  get colorScheme(): string {
    return this.layoutService.config().colorScheme;
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  changeTheme(theme: string, colorScheme: string) {
    this.theme = theme;
    this.colorScheme = colorScheme;
  }

  decrementScale() {
    this.scale--;
  }

  incrementScale() {
    this.scale++;
  }
}
