import { Item } from "./item.interface";

export interface Parcel {
  id: number;
  sampleParcelWeight: number;
  items: Item[];
}
