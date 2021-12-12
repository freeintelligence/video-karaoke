import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
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

  @ViewChildren('.genre-list-item') genreListItem: QueryList<IonItem>;

  constructor(private mediaService: MediaService, public configService: ConfigService, private genreService: GenreService, private artistService: ArtistService) {}

  ngOnInit() {
    this.run();
  }

  async run() {
    await this.loadGenres(true);
    await this.loadArtists();
    await this.loadMedia();
  }

  async loadGenres(firstLoad: boolean = false) {
    if (!this.configService.lastConfig.genreSearch) {
      return false;
    }

    this.genreLoading = true;
    this.genreList = this.injectNull(await this.genreService.getGenres());
    this.genreLoading = false;

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

    return true;
  }

  async loadMedia(genreId?: number, artistId?: number) {
    this.mediaLoading = true;
    this.mediaList = await this.mediaService.getMedia({ genreId, artistId });
    this.mediaLoading = false;

    return true;
  }

  async setTab(newTab: typeTabs['tabs'], firstLoad: boolean = false) {
    const oldTab = this.actualTab;
    this.actualTab = newTab;

    switch (this.actualTab) {
      case 'genre': {
        if (firstLoad) {
          this.genreCurrentIndex = 3;
          setTimeout(() => this.setTab('artist'), 3000);
        }
        break;
      }
    }
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
