import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonButton, IonItem } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChildren(IonItem) items: QueryList<IonItem>;
  @ViewChild('submitButton') submitButton: IonButton;

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.setFocusOnFirstElement();
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log('event', event.code);

    if (event.code === 'KeyW') {
      this.setFocusOnPreviousElement();
    } else if (event.code === 'KeyS') {
      this.setFocusOnNextElement();
    }
  }

  scrollToElement(el: IonItem) {
    ((el as any).el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  setFocusOnElement(el?: IonItem) {
    this.items.forEach(item => item.color = 'none');

    if (el) {
      el.color = 'warning';
      this.submitButton.color = 'primary';
      this.scrollToElement(el);
    }
  }

  setFocusOnFirstElement() {
    this.setFocusOnElement(this.items.get(0));
  }

  setFocusOnLastElement() {
    this.setFocusOnElement(this.items.last);
  }

  setFocusOnPreviousElement() {
    let currentId: number, len = this.items.length, current = this.items.find((item, id) => {
      currentId = id;
      return item.color !== 'none';
    });
  
    if (!current) {
      return this.setFocusOnLastElement();
    }

    if (currentId === 0) {
      this.setFocusOnElement();
      this.submitButton.color = 'warning';
      this.scrollToElement(this.submitButton as any);
    } else {
      this.setFocusOnElement(this.items.get(currentId - 1));
    }
  }

  setFocusOnNextElement() {
    let currentId: number, len = this.items.length, current = this.items.find((item, id) => {
      currentId = id;
      return item.color !== 'none';
    });

    if (!current) {
      return this.setFocusOnFirstElement();
    }

    if (currentId + 1 >= len) {
      this.setFocusOnElement();
      this.submitButton.color = 'warning';
    } else {
      this.setFocusOnElement(this.items.get(currentId + 1));
    }
  }

}
