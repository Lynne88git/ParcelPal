import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parcel } from '../interfaces/parcel.interface';
import { Item } from '../interfaces/item.interface'

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetchParcelData.component.html'
})
export class FetchParcelDataComponent {
  public parcels: Parcel[] = [];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<Parcel[]>(baseUrl + 'parcel').subscribe(result => {
      this.parcels = result;
    }, error => console.error(error));
  }
}
