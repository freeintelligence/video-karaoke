import { Injectable } from '@angular/core';

export interface CopyMediaFromUsbModalData {
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  copyMediaFromUsbModalData: CopyMediaFromUsbModalData = { completed: false };

  constructor() { }

}
