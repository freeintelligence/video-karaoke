import { Component, OnInit } from '@angular/core';
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

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
  }

}
