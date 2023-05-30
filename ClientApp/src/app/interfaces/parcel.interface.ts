import { Item } from "./item.interface";

export interface Parcel {
  id: number;
  sampleParcelWeight: number;
  weight: number;
  items: Item[];
}
