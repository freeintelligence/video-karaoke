import { Component, OnInit } from '@angular/core';
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
  genreList: any[] = [];
  artistLoading: boolean = true;
  artistList: any[] = [];
  songLoading: boolean = true;
  songList: any[] = [];

  constructor(private mediaService: MediaService, public configService: ConfigService, private genreService: GenreService, private artistService: ArtistService) {}

  ngOnInit() {
    this.run();
  }

  async run() {
    await this.loadGenres();
    await this.loadArtists();
    await this.loadSongs();
  }

  async loadGenres() {
    if (!this.configService.lastConfig.genreSearch) {
      return false;
    }

    this.genreLoading = true;
    this.genreList = await this.genreService.getGenres();
    this.genreLoading = false;

    return true;
  }

  async loadArtists() {
    if (!this.configService.lastConfig.artistSearch) {
      return false;
    }

    this.artistLoading = true;
    this.artistList = await this.artistService.getArtists();
    this.artistLoading = false;

    return true;
  }

  async loadSongs() {

  }

}
