import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ConfigSettedGuard } from 'src/guards/config-setted.guard';

const routes: Routes = [
  { path: '', redirectTo: 'music', pathMatch: 'full' },
  { path: 'config', loadChildren: () => import('./config/config.module').then(m => m.ConfigModule) },
  { path: 'music', loadChildren: () => import('./music/music.module').then(m => m.MusicModule), canActivate: [ ConfigSettedGuard ] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule],
  providers: [ ConfigSettedGuard ],
})
export class AppRoutingModule { }
