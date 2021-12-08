import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ElectronService } from 'src/app/electron.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigSettedGuard implements CanActivate {

  constructor(private electron: ElectronService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>((observer) => {
      this.electron.ipcRenderer.send('is-config-setted');
      this.electron.ipcRenderer.once('config-is-setted', (event, config) => {
        if (!config.firstConfig) {
          this.router.navigateByUrl('/config');
        }

        observer.next(config.firstConfig);
        observer.complete();
      });
    });
  }
  
}
