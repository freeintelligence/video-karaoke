import { AfterContentInit, AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonItem } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

  @ViewChildren(IonItem) items: QueryList<IonItem>;

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    console.log(this.items);
  }


}
