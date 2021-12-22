import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MediaModel } from 'src/models/media.service';

@Component({
  selector: 'app-play-media',
  templateUrl: './play-media.component.html',
  styleUrls: ['./play-media.component.scss'],
})
export class PlayMediaComponent implements OnInit, AfterViewInit {

  @Input('media') media: MediaModel;

  @ViewChild('video') video: ElementRef<HTMLVideoElement>;

  constructor(private modalController: ModalController) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.video.nativeElement.onended = (ev: Event) => {
      this.modalController.dismiss({ reason: 'complete' });
    };
  }

}
