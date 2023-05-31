import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Item } from '../interfaces/item.interface';
import { Parcel } from '../interfaces/parcel.interface';


@Injectable({
  providedIn: 'root'
})
export class ParcelDataService {
  private fileUrl = 'https://gist.githubusercontent.com/Lynne88git/552c061f4ebe867b70f6bc2376653b02/raw/876ca05861ce3bed421e0970b24563dfdfeb7ca5/input.txt';

  constructor(private http: HttpClient) { }

  fetchParcels(): Observable<Parcel[]> {
    return this.http.get(this.fileUrl, { responseType: 'text' }).pipe(
      map((data: string) => this.parseParcels(data)),
      catchError((error: any) => {
        console.error(error);
        return of([]);
      })
    );
  }

  private parseParcels(data: string): Parcel[] {
    const parcelLines = data.split('\n');
    const parcels: Parcel[] = [];

    for (const parcelLine of parcelLines) {
      if (parcelLine.trim() === '') {
        continue; // Skip empty lines
      }
      const [weightStr, itemsStr] = parcelLine.split(':');
      const weight = +weightStr.trim();
      const items = itemsStr.split('(').slice(1).map((item) => {
        const [index, name, weightStr, costStr] = item.split(',').map((item) => item.trim().replace(')', ''));
        const itemWeight = +weightStr.trim();
        const itemCost = costStr.trim();
        return { index, name, weight: itemWeight, cost: itemCost } as Item;
      });

      const parcel: Parcel = {
          weight,
          items, 
          id: 0,
          sampleParcelWeight: 0
      };

      parcels.push(parcel);
    }

    return parcels;
  }
}
