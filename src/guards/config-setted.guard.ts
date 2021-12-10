import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/services/config.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigSettedGuard implements CanActivateChild {

  constructor(private configService: ConfigService, private router: Router) {

  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(async (resolve) => {
      const config = await this.configService.getConfig();

      if (!config.firstConfig) {
        this.router.navigateByUrl('/config');
      }

      return resolve(config.firstConfig);
    })
  }
  
}
