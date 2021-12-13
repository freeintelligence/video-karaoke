import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CopyMediaFromUsbComponent } from './copy-media-from-usb.component';

describe('CopyMediaFromUsbComponent', () => {
  let component: CopyMediaFromUsbComponent;
  let fixture: ComponentFixture<CopyMediaFromUsbComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyMediaFromUsbComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CopyMediaFromUsbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
