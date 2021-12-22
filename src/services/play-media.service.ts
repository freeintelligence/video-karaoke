import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlayMediaComponent } from 'src/components/play-media/play-media.component';
import { MediaModel } from 'src/models/media.service';

@Injectable({
  providedIn: 'root'
})
export class PlayMediaService {

  modalPlay: HTMLIonModalElement;

  constructor(private modalController: ModalController) { }

  async play(media: MediaModel) {
    if (this.isPlaying()) {
      await this.modalPlay.dismiss();
    }

    this.modalPlay = await this.modalController.create({
      component: PlayMediaComponent,
      backdropDismiss: false,
      animated: true,
      keyboardClose: false,
      showBackdrop: true,
      componentProps: { media },
      cssClass: 'modal-fullscreen'
    });

    await this.modalPlay.present();
    await this.modalPlay.onWillDismiss();
    
    this.modalPlay = undefined;
  }

  isPlaying() {
    return !!this.modalPlay;
  }

}
