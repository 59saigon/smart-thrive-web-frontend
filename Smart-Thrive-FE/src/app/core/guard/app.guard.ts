import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../../main/services/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUrl = state.url; // Đường dẫn hiện tại

    if (this.userService.IsLoggedIn()) {
      if (this.userService.getRole() === "Staff" &&
        (currentUrl === '/dashboard' || currentUrl === '/apps/user' || currentUrl === '/')) {
        this.router.navigate(['/approvals']);
        return false;
      }

      if (this.userService.getRole() === "Provider" &&
        (currentUrl === '/' || currentUrl === '/dashboard' || currentUrl === '/apps/user' || currentUrl === '/apps/package' || currentUrl === '/apps/subject' || currentUrl === '/apps/order' || currentUrl === '/apps/session')) {
        this.router.navigate(['/apps/course']);
        return false;
      }

      if (
        currentUrl === '/auth/login' ||
        currentUrl === '/auth/register' ||
        currentUrl === '/' ||
        currentUrl === '/apps'
      ) {
        
        if (this.userService.getRole() == 'Provider') {
          this.router.navigate(['/approvals']);
        }
        if (this.userService.getRole() == 'Staff') {
          this.router.navigate(['/apps/course']);
        } else {
          this.router.navigate(['/dashboard']);
        }
        return false; // Ngăn kích hoạt tuyến đường
      }
      return true; // Cho phép truy cập nếu đã đăng nhập
    } else {
      if (
        currentUrl === '/auth/login' ||
        currentUrl === '/auth/register'
      ) {
        // Nếu chưa đăng nhập và cố gắng truy cập trang đăng nhập hoặc root, cho phép
        return true; // Cho phép truy cập
      }
      // Nếu chưa đăng nhập và cố gắng truy cập các trang khác, chuyển hướng đến trang đăng nhập
      this.router.navigateByUrl('/auth/login'); // Chuyển hướng đến trang đăng nhập
      return false; // Ngăn kích hoạt tuyến đường
    }
  }

}
