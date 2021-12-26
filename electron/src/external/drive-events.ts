import { Subject } from 'rxjs';
import { Drive, list } from 'drivelist';
import { startMonitoring, on, Device } from 'usb-detection';

export class DriveEvents {

  static DRIVE_DETECT_SETTINGS = { sleepWaitMs: 1*1000, maxWaitMs: 30*1000 };

  public onAdd: Subject<Drive[]>;
  public onRemove: Subject<Drive[]>;
  public onChange: Subject<Drive[]>;

  constructor() {
    this.createSubjects();
    this.on();
  }

  createSubjects() {
    this.onAdd = new Subject();
    this.onRemove = new Subject();
    this.onChange = new Subject();

    this.onAdd.subscribe(e => this.onChange.next(e));
    this.onRemove.subscribe(e => this.onChange.next(e));
  }

  on() {
    startMonitoring();

    on('add', async (device: Device) => {
      let waiting: number = 0;
      const drivers = (await list()).filter(e => e.isRemovable);

      while (true) {
        waiting += DriveEvents.DRIVE_DETECT_SETTINGS.sleepWaitMs;
        await this.wait(DriveEvents.DRIVE_DETECT_SETTINGS.sleepWaitMs);

        const newDrivers = (await list()).filter(e => e.isRemovable);

        if (drivers.length < newDrivers.length) {
          this.onAdd.next(newDrivers);
          break;
        }

        if (waiting >= DriveEvents.DRIVE_DETECT_SETTINGS.maxWaitMs) {
          break;
        }
      }
    });

    on('remove', async (device: Device) => {
      const drivers = (await list()).filter(e => e.isRemovable);

      this.onRemove.next(drivers);
    });
  }

  wait(ms: number = 1000) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => resolve(), ms);
    });
  }

}
