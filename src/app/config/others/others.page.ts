import { Component, HostListener, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonItem, LoadingController } from '@ionic/angular';
import { ConfigService } from 'src/services/config.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.page.html',
  styleUrls: ['./others.page.scss'],
})
export class OthersPage implements OnInit {

  @ViewChildren(IonItem) items: QueryList<IonItem>;
  @ViewChild('submitButton') submitButton: IonButton;

  configGroup: FormGroup = new FormGroup({
    genreSearch: new FormControl(null),
    artistSearch: new FormControl(null),
  });

  constructor(private loadingController: LoadingController, private configService: ConfigService, private router: Router) { }

  ngOnInit() {
    this.loadConfig();
  }

  async loadConfig() {
    const config = await this.configService.getConfig();
    this.configGroup.controls.genreSearch.setValue(config.genreSearch);
    this.configGroup.controls.artistSearch.setValue(config.artistSearch);
  }

  ngAfterViewInit() {
    this.setFocusOnNextElement();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
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

  setFocusOnPreviousElement() {
    let currentId: number, len = this.items.length, current = this.items.find((item, id) => {
      currentId = id;
      return item.color !== 'none';
    });
  
    if (!current) {
      return this.setFocusOnElement(this.items.last);
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
      return this.setFocusOnElement(this.items.get(0));
    }

    if (currentId + 1 >= len) {
      this.setFocusOnElement();
      this.submitButton.color = 'warning';
    } else {
      this.setFocusOnElement(this.items.get(currentId + 1));
    }
  }

  async onSubmit() {
    const loading = await this.loadingController.create({
      message: 'Guardando configuración...',
      backdropDismiss: false,
      keyboardClose: false,
    });
    await loading.present();

    await this.configService.setConfig(this.configGroup.value);
    this.router.navigateByUrl('/');

    await loading.dismiss();
  }

}
