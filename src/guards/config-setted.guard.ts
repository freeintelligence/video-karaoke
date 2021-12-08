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
      this.electron.ipcRenderer.emit('is-config-setted');
      this.electron.ipcRenderer.once('config-is-setted', (event, setted) => {
        const isSetted = Boolean(setted);

        if (!isSetted) {
          this.router.navigateByUrl('/config');
        }

        observer.next(isSetted);
        observer.complete();
      });
    });
  }
  
}
