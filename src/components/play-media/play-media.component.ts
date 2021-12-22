import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MediaModel } from 'src/models/media.service';
import { ConfigService } from 'src/services/config.service';

@Component({
  selector: 'app-play-media',
  templateUrl: './play-media.component.html',
  styleUrls: ['./play-media.component.scss'],
})
export class PlayMediaComponent implements OnInit, AfterViewInit {

  @Input('media') media: MediaModel;

  @ViewChild('video') video: ElementRef<HTMLVideoElement>;

  constructor(private modalController: ModalController, private configService: ConfigService) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.video.nativeElement.onended = (ev: Event) => {
      this.modalController.dismiss({ reason: 'complete' });
    };
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === this.configService.lastConfig.buttonBack) {
      this.modalController.dismiss({ reason: 'cancel' });
    }
  }

}
