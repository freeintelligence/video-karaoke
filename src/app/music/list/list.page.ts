import { Component, OnInit } from '@angular/core';
import { ArtistModel } from 'src/models/artist.service';
import { GenreModel } from 'src/models/genre.service';
import { MediaModel } from 'src/models/media.service';
import { ArtistService } from 'src/services/artist.service';
import { ConfigService } from 'src/services/config.service';
import { GenreService } from 'src/services/genre.service';
import { MediaService } from 'src/services/media.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  genreLoading: boolean = true;
  genreList: GenreModel[] = [];
  artistLoading: boolean = true;
  artistList: ArtistModel[] = [];
  mediaLoading: boolean = true;
  mediaList: MediaModel[] = [];

  constructor(private mediaService: MediaService, public configService: ConfigService, private genreService: GenreService, private artistService: ArtistService) {}

  ngOnInit() {
    this.run();
  }

  async run() {
    await this.loadGenres();
    await this.loadArtists();
    await this.loadMedia();
  }

  async loadGenres() {
    if (!this.configService.lastConfig.genreSearch) {
      return false;
    }

    this.genreLoading = true;
    this.genreList = this.injectNull(await this.genreService.getGenres());
    this.genreLoading = false;

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

}
