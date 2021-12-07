import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  genreList: any[] = [];

  constructor() { }

  ngOnInit() {
    this.genreList = [
      { id: 0, name: 'Reggae', image: 'https://cdn.quonomy.com/3485/conversions/17-sorprendentes-curiosidades-sobre-la-musica-reggae-h-lg.jpg' },
      { id: 1, name: 'Rock', image: 'https://www.poblanerias.com/wp-content/archivos/2020/07/Guitarra-1021x580.jpg' },
      { id: 0, name: 'Reggaeton', image: 'https://www.cinconoticias.com/wp-content/uploads/reggaeton-696x392.jpg' },
      { id: 0, name: 'Clasica', image: 'https://i.ytimg.com/vi/dhzIMZvYgaA/maxresdefault.jpg' },
    ];
  }

}
