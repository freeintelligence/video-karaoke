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

  isLoading: boolean = false;

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
    if (event.code === this.configService.lastConfig.buttonUp) {
      this.setFocusOnPreviousElement();
    } else if (event.code === this.configService.lastConfig.buttonDown) {
      this.setFocusOnNextElement();
    } else if (event.code === this.configService.lastConfig.buttonEnter) {
      const current = this.getCurrentItem();

      if (!current.item && this.submitButton.color === 'warning') {
        this.onSubmit();
      } else if (current.item) {
        switch (current.index) {
          case 0: {
            this.configGroup.controls.genreSearch.setValue(!Boolean(this.configGroup.controls.genreSearch.value));
            break;
          }
          default: {
            this.configGroup.controls.artistSearch.setValue(!Boolean(this.configGroup.controls.artistSearch.value));
            break;
          }
        }
      }
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
    const current = this.getCurrentItem();
  
    if (!current.item) {
      return this.setFocusOnElement(this.items.last);
    }

    if (current.index === 0) {
      this.setFocusOnElement();
      this.submitButton.color = 'warning';
      this.scrollToElement(this.submitButton as any);
    } else {
      this.setFocusOnElement(this.items.get(current.index - 1));
    }
  }

  setFocusOnNextElement() {
    const current = this.getCurrentItem();

    if (!current.item) {
      return this.setFocusOnElement(this.items.get(0));
    }

    if (current.index + 1 >= current.len) {
      this.setFocusOnElement();
      this.submitButton.color = 'warning';
    } else {
      this.setFocusOnElement(this.items.get(current.index + 1));
    }
  }

  getCurrentItem() {
    let index: number = -1, len = this.items.length, item = this.items.find((item, id) => {
      index = id;
      return item.color !== 'none';
    });

    return { index, len, item };
  }

  async onSubmit() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Guardando configuración...',
      backdropDismiss: false,
      keyboardClose: false,
    });
    await loading.present();

    await this.configService.setConfig(this.configGroup.value);
    this.router.navigateByUrl('/');

    await loading.dismiss();
    this.isLoading = false;
  }

}
