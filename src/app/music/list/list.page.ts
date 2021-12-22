import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AppUtils } from 'src/app/app.utils';
import { ArtistModel } from 'src/models/artist.service';
import { GenreModel } from 'src/models/genre.service';
import { MediaModel } from 'src/models/media.service';
import { ArtistService } from 'src/services/artist.service';
import { ConfigService } from 'src/services/config.service';
import { GenreService } from 'src/services/genre.service';
import { MediaService } from 'src/services/media.service';
import { PlayMediaService } from 'src/services/play-media.service';
import { UsbDevicesService } from 'src/services/usb-devices.service';

interface typeTabs {
  tabs: 'genre'|'artist'|'media'
}

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  actualTab: typeTabs['tabs'] = 'media';

  genreLoading: boolean = false;
  genreList: GenreModel[] = [];
  genreCurrentIndex: number;
  artistLoading: boolean = false;
  artistList: ArtistModel[] = [];
  artistCurrentIndex: number;
  mediaLoading: boolean = false;
  mediaList: MediaModel[] = [];
  mediaCurrentIndex: number;

  @ViewChild('virtualScrollGenre') virtualScrollGenre: CdkVirtualScrollViewport;
  @ViewChild('virtualScrollArtist') virtualScrollArtist: CdkVirtualScrollViewport;
  @ViewChild('virtualScrollMedia') virtualScrollMedia: CdkVirtualScrollViewport;

  AppUtils = AppUtils;
  
  constructor(private playMediaService: PlayMediaService, private mediaService: MediaService, public configService: ConfigService, private genreService: GenreService, private artistService: ArtistService, private usbDevicesService: UsbDevicesService) {}

  ngOnInit() {
    this.run();
  }

  async run() {
    await this.loadGenres();
  }

  async loadGenres() {
    if (!this.configService.lastConfig.genreSearch) {
      return await this.loadArtists();
    }

    this.genreLoading = true;
    this.genreList = this.injectNull(await this.genreService.getGenres());
    this.genreLoading = false;
    this.genreCurrentIndex = this.genreList.length ? 0 : undefined;

    await this.loadArtists();
    await this.setTab('media', 'left');

    return true;
  }

  async loadArtists() {
    if (!this.configService.lastConfig.artistSearch) {
      return await this.loadMedia();
    }

    this.artistLoading = true;
    this.artistList = this.injectNull(await this.artistService.getArtists({ genreId: this.getCurrentGenre() ? this.getCurrentGenre().id : null }));
    this.artistLoading = false;
    this.artistCurrentIndex = this.artistList.length ? 0 : undefined;

    await this.loadMedia();

    return true;
  }

  async loadMedia() {
    this.mediaLoading = true;
    this.mediaList = await this.mediaService.getMedia({ genreId: this.getCurrentGenre() ? this.getCurrentGenre().id : null, artistId: this.getCurrentArtist() ? this.getCurrentArtist().id : null });
    this.mediaLoading = false;
    this.mediaCurrentIndex = this.mediaList.length ? 0 : undefined;

    return true;
  }

  async setTab(newTab: typeTabs['tabs'], direction: 'left'|'right') {
    this.actualTab = newTab;

    if (this.actualTab === 'genre' && !this.configService.lastConfig.genreSearch && direction === 'left') {
      this.setTab('media', direction);
    } else if (this.actualTab === 'genre' && !this.configService.lastConfig.genreSearch && direction === 'right') {
      this.setTab('artist', direction);
    } else if (this.actualTab === 'artist' && !this.configService.lastConfig.artistSearch && direction === 'left') {
      this.setTab('genre', direction);
    } else if (this.actualTab === 'artist' && !this.configService.lastConfig.artistSearch && direction === 'right') {
      this.setTab('media', direction);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.genreLoading || this.artistLoading || this.mediaLoading) {
      return false;
    }
    if (this.usbDevicesService.isDetectChangeDevicesActive) {
      return false;
    }
    if (this.playMediaService.isPlaying()) {
      return false;
    }

    if (event.code === this.configService.lastConfig.buttonUp) {
      // Up
      if (this.actualTab === 'genre') {
        this.genreCurrentIndex = this.genreCurrentIndex - 1 < 0 ? this.genreList.length - 1 : this.genreCurrentIndex - 1;
        const totalHeight = document.querySelector('.genre-list ion-card-content').clientHeight;
        const itemHeight = document.querySelector('.genre-list ion-card-content cdk-virtual-scroll-viewport').getAttribute('itemSize');
        const minus = Math.round(totalHeight / Number(itemHeight)) / 2;
        this.virtualScrollGenre.scrollToIndex(this.genreCurrentIndex - minus + 1, 'smooth');
        this.loadArtists();
      } else if (this.actualTab === 'artist') {
        this.artistCurrentIndex = this.artistCurrentIndex - 1 < 0 ? this.artistList.length - 1 : this.artistCurrentIndex - 1;
        const totalHeight = document.querySelector('.artist-list ion-card-content').clientHeight;
        const itemHeight = document.querySelector('.artist-list ion-card-content cdk-virtual-scroll-viewport').getAttribute('itemSize');
        const minus = Math.round(totalHeight / Number(itemHeight)) / 2;
        this.virtualScrollArtist.scrollToIndex(this.artistCurrentIndex - minus + 1, 'smooth');
        this.loadMedia();
      } else if (this.actualTab === 'media') {
        this.mediaCurrentIndex = this.mediaCurrentIndex - 1 < 0 ? this.mediaList.length - 1 : this.mediaCurrentIndex - 1;
        const totalHeight = document.querySelector('.songs-list ion-card-content').clientHeight;
        const itemHeight = document.querySelector('.songs-list ion-card-content cdk-virtual-scroll-viewport').getAttribute('itemSize');
        const minus = Math.round(totalHeight / Number(itemHeight)) / 2;
        this.virtualScrollMedia.scrollToIndex(this.mediaCurrentIndex - minus + 1, 'smooth');
      }
    } else if (event.code === this.configService.lastConfig.buttonDown) {
      // Down
      if (this.actualTab === 'genre') {
        this.genreCurrentIndex = this.genreCurrentIndex + 1 >= this.genreList.length ? 0 : this.genreCurrentIndex + 1;
        const totalHeight = document.querySelector('.genre-list ion-card-content').clientHeight;
        const itemHeight = document.querySelector('.genre-list ion-card-content cdk-virtual-scroll-viewport').getAttribute('itemSize');
        const minus = Math.round(totalHeight / Number(itemHeight)) / 2;
        this.virtualScrollGenre.scrollToIndex(this.genreCurrentIndex - minus + 1, 'smooth');
        this.loadArtists();
      } else if (this.actualTab === 'artist') {
        this.artistCurrentIndex = this.artistCurrentIndex + 1 >= this.artistList.length ? 0 : this.artistCurrentIndex + 1;
        const totalHeight = document.querySelector('.artist-list ion-card-content').clientHeight;
        const itemHeight = document.querySelector('.artist-list ion-card-content cdk-virtual-scroll-viewport').getAttribute('itemSize');
        const minus = Math.round(totalHeight / Number(itemHeight)) / 2;
        this.virtualScrollArtist.scrollToIndex(this.artistCurrentIndex - minus + 1, 'smooth');
        this.loadMedia();
      } else if (this.actualTab === 'media') {
        this.mediaCurrentIndex = this.mediaCurrentIndex + 1 >= this.mediaList.length ? 0 : this.mediaCurrentIndex + 1;
        const totalHeight = document.querySelector('.songs-list ion-card-content').clientHeight;
        const itemHeight = document.querySelector('.songs-list ion-card-content cdk-virtual-scroll-viewport').getAttribute('itemSize');
        const minus = Math.round(totalHeight / Number(itemHeight)) / 2;
        this.virtualScrollMedia.scrollToIndex(this.mediaCurrentIndex - minus + 1, 'smooth');
      }
    } else if (event.code === this.configService.lastConfig.buttonLeft) {
      // Left
      if (this.actualTab === 'genre') {
        this.setTab('media', 'left');
      } else if (this.actualTab === 'artist') {
        this.setTab('genre', 'left');
      } else if (this.actualTab === 'media') {
        this.setTab('artist', 'left');
      }
    } else if (event.code === this.configService.lastConfig.buttonRight) {
      // Right
      if (this.actualTab === 'genre') {
        this.setTab('artist', 'right');
      } else if (this.actualTab === 'artist') {
        this.setTab('media', 'right');
      } else if (this.actualTab === 'media') {
        this.setTab('genre', 'right');
      }
    } else if (event.code === this.configService.lastConfig.buttonEnter) {
      console.log('desde list page');
      const currentMedia = this.getCurrentMedia();

      if (!currentMedia) {
        return false;
      }

      this.playMediaService.play(currentMedia);
    }
  }

  getCurrentGenre(): GenreModel {
    if (typeof this.genreCurrentIndex !== 'number') {
      return null;
    }

    return this.genreList[this.genreCurrentIndex];
  }

  getCurrentArtist(): ArtistModel {
    if (typeof this.artistCurrentIndex !== 'number') {
      return null;
    }

    return this.artistList[this.artistCurrentIndex];
  }

  getCurrentMedia(): MediaModel {
    if (typeof this.mediaCurrentIndex !== 'number') {
      return null;
    }

    return this.mediaList[this.mediaCurrentIndex];
  }

  injectNull(arr: any[], every: number = 6): any[] {
    const result = [];
    const add = () => result.push({ name: 'Todos', imageUrl: '/assets/images/check-all.png' });

    if (!(arr instanceof Array)) {
      arr = [];
    }

    add();

    arr.forEach((value, index) => {
      if (index % every === 0 && index) {
        add();
      }

      result.push(value);
    });

    return result;
  }

  getItemColor(index: number, fromTab: typeTabs['tabs']) {
    if (index === this.genreCurrentIndex && fromTab === 'genre') {
      return this.actualTab === 'genre' ? 'warning' : 'primary';
    } else if (index === this.artistCurrentIndex && fromTab === 'artist') {
      return this.actualTab === 'artist' ? 'warning' : 'primary';
    } else if (index === this.mediaCurrentIndex && fromTab === 'media') {
      return this.actualTab === 'media' ? 'warning' : 'primary';
    }
  }

  getMediaContainerWidth() {
    let px = 0, genreWidth = 140, genreActualWidth = 332, artistWidth = 140, artistActualWidth = 332, miniPlayWidth = 448;

    // Genre list
    if (this.configService.lastConfig.genreSearch) {
      px += this.actualTab === 'genre' ? genreActualWidth : genreWidth;
    }

    // Artist list
    if (this.configService.lastConfig.artistSearch) {
      px += this.actualTab === 'artist' ? artistActualWidth : artistWidth;
    }

    // Miniplay
    px += miniPlayWidth;

    return `calc(100% - ${px}px)`;
  }

}
