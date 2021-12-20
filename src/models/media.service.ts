import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app.config';
import { AppUtils } from 'src/app/app.utils';
import { ElectronService } from 'src/app/electron.service';

@Injectable({
  providedIn: 'root'
})
export class MediaModel {

  id: number;
  name: string;
  imageExt?: string;
  artistId?: number;

  constructor(private electron: ElectronService) {}

  getImageUrl() {
    return this.imageExt ? `http://localhost:${AppConfig.httpServer.port}/images/media-images/${this.id}${this.imageExt}` : '/assets/images/no-image-equalizer.gif';
  }

  new() {
    return new MediaModel(this.electron);
  }

  newFromArray(data: any): MediaModel[] {
    const results: MediaModel[] = []

    for (const d of data) {
      const n = this.new()
      AppUtils.replaceProperties(d, n)
      results.push(n)
    }

    return results
  }

  newFrom(data: any): MediaModel {
    return this.newFromArray([data])[0]
  }

}
