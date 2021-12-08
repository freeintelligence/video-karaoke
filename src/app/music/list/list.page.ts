import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  genreList: any[] = [];
  artistList: any[] = [];

  constructor() { }

  ngOnInit() {
    this.genreList = [
      { id: 0, name: 'Reggae', image: 'https://cdn.quonomy.com/3485/conversions/17-sorprendentes-curiosidades-sobre-la-musica-reggae-h-lg.jpg' },
      { id: 1, name: 'Rock', image: 'https://www.poblanerias.com/wp-content/archivos/2020/07/Guitarra-1021x580.jpg' },
      { id: 2, name: 'Reggaeton', image: 'https://www.cinconoticias.com/wp-content/uploads/reggaeton-696x392.jpg' },
      { id: 3, name: 'Clasica', image: 'https://i.ytimg.com/vi/dhzIMZvYgaA/maxresdefault.jpg' },
    ];

    this.artistList = [
      { id: 0, name: 'The Wailers', image: 'https://www.lifeder.com/wp-content/uploads/2017/03/wailers-reggae.jpg' },
      { id: 1, name: 'Bob Marley', image: 'https://www.lifeder.com/wp-content/uploads/2017/03/bob-marley.jpg' },
      { id: 2, name: 'Peter Tosh', image: 'https://www.lifeder.com/wp-content/uploads/2020/02/347px-PeterToshWithRobbieShakespeare1978-304x420.jpg' },
      { id: 3, name: 'Bunny Wailer', image: 'https://www.lifeder.com/wp-content/uploads/2020/02/640px-Bunny-Wailer-Smile-Jamaica-2008.jpg' },
      { id: 4, name: 'Toots and the Maytals', image: 'https://www.lifeder.com/wp-content/uploads/2017/03/toots-and-the-maytals-2.jpg' },
      { id: 5, name: 'Black Uhuru', image: 'https://www.lifeder.com/wp-content/uploads/2020/02/Black-Uhuru-631x420.jpg' },
      { id: 6, name: 'UB40', image: 'https://www.lifeder.com/wp-content/uploads/2020/02/640px-UB40_feat._Ali_Campbell_Astro__Mickey_Virtue_-_2018174193650_2018-06-23_Rock_the_Ring_-_1D_X_MK_II_-_1061_-_AK8I6742-630x420.jpg' },
      { id: 7, name: 'Inner Circle', image: 'https://www.lifeder.com/wp-content/uploads/2017/03/inner-circle-banda-reggaelifederimagen.jpg' },
      { id: 8, name: 'Jimmy Cliff', image: 'https://www.lifeder.com/wp-content/uploads/2020/02/640px-Jimmy_Cliff_-_Festival_du_Bout_du_Monde_2012_-_022-630x420.jpg' },
      { id: 9, name: 'The Abyssianians', image: 'https://www.lifeder.com/wp-content/uploads/2020/02/640px-The_Abyssinians_LanzamientoRototomReggaeContestLatino10-11_20101015-630x420.jpg' },
    ];
  }

}
