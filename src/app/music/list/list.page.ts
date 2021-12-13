import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonItem } from '@ionic/angular';
import { ArtistModel } from 'src/models/artist.service';
import { GenreModel } from 'src/models/genre.service';
import { MediaModel } from 'src/models/media.service';
import { ArtistService } from 'src/services/artist.service';
import { ConfigService } from 'src/services/config.service';
import { GenreService } from 'src/services/genre.service';
import { MediaService } from 'src/services/media.service';

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

  genreLoading: boolean = true;
  genreList: GenreModel[] = [];
  genreCurrentIndex: number;
  artistLoading: boolean = true;
  artistList: ArtistModel[] = [];
  artistCurrentIndex: number;
  mediaLoading: boolean = true;
  mediaList: MediaModel[] = [];
  mediaCurrentIndex: number;

  @ViewChild('virtualScrollGenre') virtualScrollGenre: CdkVirtualScrollViewport;
  @ViewChild('virtualScrollArtist') virtualScrollArtist: CdkVirtualScrollViewport;
  @ViewChild('virtualScrollMedia') virtualScrollMedia: CdkVirtualScrollViewport;

  constructor(private mediaService: MediaService, public configService: ConfigService, private genreService: GenreService, private artistService: ArtistService) {}

  ngOnInit() {
    this.run();
  }

  async run() {
    await this.loadGenres(true);
  }

  async loadGenres(firstLoad: boolean = false) {
    if (!this.configService.lastConfig.genreSearch) {
      return false;
    }

    this.genreLoading = true;
    this.genreList = this.injectNull(await this.genreService.getGenres());
    this.genreLoading = false;

    this.genreCurrentIndex = this.genreList.length ? 0 : undefined;

    if (firstLoad) {
      await this.setTab('genre', firstLoad);
    }

    return true;
  }

  async loadArtists(genreId?: number) {
    if (!this.configService.lastConfig.artistSearch) {
      return false;
    }

    this.artistLoading = true;
    this.artistList = this.injectNull(await this.artistService.getArtists({ genreId }));
    this.artistLoading = false;

    this.artistCurrentIndex = this.artistList.length ? 0 : undefined;

    return true;
  }

  async loadMedia(genreId?: number, artistId?: number) {
    this.mediaLoading = true;
    this.mediaList = await this.mediaService.getMedia({ genreId, artistId });
    this.mediaLoading = false;

    this.mediaCurrentIndex = this.mediaList.length ? 0 : undefined;

    return true;
  }

  async setTab(newTab: typeTabs['tabs'], firstLoad: boolean = false) {
    this.actualTab = newTab;

    switch (this.actualTab) {
      case 'genre': {
        if (firstLoad) {
          await this.loadArtists();
          this.setTab('artist', firstLoad);
        }
        break;
      }
      case 'artist': {
        if (firstLoad) {
          await this.loadMedia();
          this.setTab('media', firstLoad);
        }
      }
      case 'media': {
        if (firstLoad) {

        }
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.genreLoading || this.artistLoading || this.mediaLoading) {
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
      } else if (this.actualTab === 'artist') {
        this.artistCurrentIndex = this.artistCurrentIndex - 1 < 0 ? this.artistList.length - 1 : this.artistCurrentIndex - 1;
        const totalHeight = document.querySelector('.artist-list ion-card-content').clientHeight;
        const itemHeight = document.querySelector('.artist-list ion-card-content cdk-virtual-scroll-viewport').getAttribute('itemSize');
        const minus = Math.round(totalHeight / Number(itemHeight)) / 2;
        this.virtualScrollArtist.scrollToIndex(this.artistCurrentIndex - minus + 1, 'smooth');
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
      } else if (this.actualTab === 'artist') {
        this.artistCurrentIndex = this.artistCurrentIndex + 1 >= this.artistList.length ? 0 : this.artistCurrentIndex + 1;
        const totalHeight = document.querySelector('.artist-list ion-card-content').clientHeight;
        const itemHeight = document.querySelector('.artist-list ion-card-content cdk-virtual-scroll-viewport').getAttribute('itemSize');
        const minus = Math.round(totalHeight / Number(itemHeight)) / 2;
        this.virtualScrollArtist.scrollToIndex(this.artistCurrentIndex - minus + 1, 'smooth');
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
        this.setTab('media');
      } else if (this.actualTab === 'artist') {
        this.setTab('genre');
      } else if (this.actualTab === 'media') {
        this.setTab('artist');
      }
    } else if (event.code === this.configService.lastConfig.buttonRight) {
      // Right
      if (this.actualTab === 'genre') {
        this.setTab('artist');
      } else if (this.actualTab === 'artist') {
        this.setTab('media');
      } else if (this.actualTab === 'media') {
        this.setTab('genre');
      }
    } else if (event.code === this.configService.lastConfig.buttonEnter) {
      
    }
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

}
