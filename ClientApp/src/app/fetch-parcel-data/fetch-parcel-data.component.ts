import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parcel } from '../interfaces/parcel.interface';
import { Item } from '../interfaces/item.interface'

@Component({
  selector: 'app-fetch-parcel-data',
  templateUrl: './fetch-parcel-data.component.html',
  styleUrls: ['./fetch-parcel-data.component.css']
})
export class FetchParcelDataComponent {
  public parcels: Parcel[] = [];
  private fileUrl = 'https://gist.githubusercontent.com/Lynne88git/552c061f4ebe867b70f6bc2376653b02/raw/876ca05861ce3bed421e0970b24563dfdfeb7ca5/input.txt';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchParcels();
  }

  private fetchParcels(): void {
    this.http.get(this.fileUrl, { responseType: 'text' }).subscribe(
      (data: string) => {
        this.parseParcels(data);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  private parseParcels(data: string): void {
    const lines = data.split('\n');
    for (const line of lines) {
      const [idStr, itemsStr] = line.split(':');
      const id = parseInt(idStr.trim());
      const items = itemsStr
        .trim()
        .split('(')
        .slice(1)
        .filter((item: string) => item.trim() !== '')
        .map((item: string) => {
          const [index, name, weightStr, costStr] = item
            .replace(')', '')
            .split(',')
            .map((value: string) => value.trim());
          const weight = parseFloat(weightStr);
          const cost = parseFloat(costStr.replace('€', ''));
          return {
            index: index,
            name: name,
            weight: weight,
            cost: cost
          } as Item;
        });
      console.log(`Items for Parcel ID ${id}:`);
      for (const item of items) {
        console.log(`Index: ${item.index}`);
        console.log(`Name: ${item.name}`);
        console.log(`Weight: ${item.weight}`);
        console.log(`Cost: ${item.cost}`);
        console.log('   ');
      }
    }
  }
}
