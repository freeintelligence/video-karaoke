import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { AppUtils } from 'src/app/app.utils';
import { ElectronService } from 'src/app/electron.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistModel {

  id: number;
  name: string;
  imageExt?: string;

  constructor(private electron: ElectronService) {}

  get imageUrl(): string {
    return this.imageExt ? `http://localhost:${AppConfig.httpServer.port}/images/artist-images/${this.id}${this.imageExt}` : '/assets/images/no-image.png';
  }

  new() {
    return new ArtistModel(this.electron);
  }

  newFromArray(data: any): ArtistModel[] {
    const results: ArtistModel[] = []

    for (const d of data) {
      const n = this.new()
      AppUtils.replaceProperties(d, n)
      results.push(n)
    }

    return results
  }

  newFrom(data: any): ArtistModel {
    return this.newFromArray([data])[0]
  }

}
