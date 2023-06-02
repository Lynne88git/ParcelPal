import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Item } from '../../interfaces/item.interface';
import { Parcel } from '../../interfaces/parcel.interface';
import { ParcelDataService } from '../../services/parcel-data-service';

@Component({
  selector: 'app-packing-form',
  templateUrl: './packing-form.component.html',
  styleUrls: ['./packing-form.component.css']
})
export class PackingFormComponent implements OnInit {
  packingForm: FormGroup;
  availableItems: Item[] = [];
  selectedItemsList: Item[] = [];
  showWeightError = false;
  isParcelSelected = false;
  selectedParcelWeight: number | undefined;
  solution = '';
  error = '';


  constructor(private fb: FormBuilder, private parcelDataService: ParcelDataService) { }


  ngOnInit(): void {
    this.initForm();
    this.parcelDataService.fetchParcels().subscribe(
      (response: string) => {
        const parcels: Parcel[] = this.parseResponse(response);
        const { availableItems, sampleParcelWeights, selectedItems } = this.parseInputData(parcels);
        this.availableItems = availableItems;
        // Update this.sampleParcelWeights to store the sample parcel weights
        this.sampleParcelWeights = sampleParcelWeights;
        this.selectedItems = selectedItems;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  //initForm(): void {
  //  this.packingForm = this.fb.group({
  //    weightLimit: ['', Validators.required],
  //    items: this.fb.array([])
  //  });

  //  this.packingForm.get('weightLimit')?.valueChanges.subscribe((selectedWeight) => {
  //    this.filterItemsByWeight(selectedWeight);
  //  });
  //}

  //get items(): FormArray {
  //  return this.packingForm.get('items') as FormArray;
  //}

  //createItemGroup(item: Item): FormGroup {
  //  return this.fb.group({
  //    index: [item.index, Validators.required],
  //    weight: [`${item.weight}kg`],
  //    cost: [`${item.cost}`]
  //  });
  //}
  // Adds the selected sample parcel not the items in it
  //addItem(): void {
  //  const selectedWeight = this.packingForm.get('weightLimit')?.value;
  //  if (selectedWeight) {
  //    const emptyItem: Item = { index: '', name: '', weight: 0, cost: '' };
  //    this.items.push(this.createItemGroup(emptyItem));
  //    this.selectedParcelWeight = selectedWeight; // Assign the selected parcel weight

  //    console.log('Selected Parcel Weight:', selectedWeight);

  //  } else {
  //    // Display an error message 
  //    this.showWeightError = true; // Set the error flag to display the message
  //    console.log('Please select a parcel/box weight before adding an item.');
  //  }
  //}

  //removeItem(selectedItem: any): void {
  //  const index = this.selectedItemsList.indexOf(selectedItem);
  //  if (index !== -1) {
  //    this.selectedItemsList.splice(index, 1); // Remove the item from the selectedItemsList
  //    console.log('Selected Items:', this.selectedItemsList); // Log the updated selectedItemsList
  //  }
  //}


  //filterItemsByWeight(selectedWeight: number): void {
  //  const selectedItems = this.selectedItems.find(item => item.weight === selectedWeight);
  //  if (selectedItems) {
  //    this.availableItems = selectedItems.items;
  //  } else {
  //    this.availableItems = [];
  //  }
  //}

  parseInputData(response: string): { availableItems: Item[], sampleParcelWeights: number[], selectedItems: { weight: number, items: Item[] }[] } {
    const lines = response.trim().split('\n');
    const availableItems: Item[] = [];
    const sampleParcelWeights: number[] = [];
    const selectedItems: { weight: number, items: Item[] }[] = [];

    for (const line of lines) {
      const parts = line.split(':');
      const weightLimit = Number(parts[0].trim());
      const itemListString = parts[1].trim();
      const items = this.parseItemList(itemListString);

      availableItems.push(...items); // Add the items to the availableItems array
      sampleParcelWeights.push(weightLimit); // Add the weight limit to the sampleParcelWeights array
      selectedItems.push({ weight: weightLimit, items: items }); // Add the weight limit and items as an object to the selectedItems array
    }

    return { availableItems, sampleParcelWeights, selectedItems };
  }


  //updateItemsByWeight(): void {
  //  for (const { weight, items } of this.selectedItems) {
  //    this.itemsByWeight[weight] = items.map((item) => ({
  //      value: { index: item.index, name: item.name, weight: item.weight, cost: item.cost },
  //      label: `${item.index}, ${item.name}`,
  //      weight: `${item.weight}kg`,
  //      cost: `${item.cost}`,
  //      selectedItem: false // Add a new property to track selection
  //    }));
  //  }
  //}

  // Adds actual items to your parcel
  addItemToParcel(item: Item): void {
    this.selectedItemsList.push(item);
    console.log('Selected Item:', item);
  }

  parseItemList(itemListString: string): Item[] {
    const items: Item[] = [];
    // Parse the itemListString and extract individual items
    // Example implementation:
    const itemStrings = itemListString.split(',');
    for (const itemString of itemStrings) {
      const parts = itemString.trim().split('|');
      const index = parts[0].trim();
      const name = parts[1].trim();
      const weight = Number(parts[2].trim());
      const cost = parts[3].trim();
      const item: Item = { index, name, weight, cost };
      items.push(item);
    }
    return items;
  }


  private parseResponse(response: string): Parcel[] {
    const parcels: Parcel[] = [];
    const lines = response.trim().split('\n');

    for (const line of lines) {
      const parts = line.split(':');
      const weightLimit = Number(parts[0].trim());
      const itemListString = parts[1].trim();
      const items = this.parseItemList(itemListString);
      const parcel: Parcel = {
        id: 0, // Set the appropriate ID if available
        sampleParcelWeight: weightLimit,
        weight: 0, // Set the appropriate weight if available
        items: items
      };
      parcels.push(parcel);
    }

    return parcels;
  }

  submitForm(weightLimit: number) {
    this.parcelDataService.fetchParcels().subscribe(
      (result: string) => {
        this.solution = this.getSolution(result, weightLimit);
        this.error = ''; // Clear any previous error
      },
      (error: string) => {
        this.solution = ''; // Clear the solution in case of an error
        this.error = error;
      }
    );
  }

  private getSolution(result: string, weightLimit: number): string {
    const lines = result.split('\n');
    const lineIndex = weightLimit - 1;
    if (lineIndex >= 0 && lineIndex < lines.length) {
      return lines[lineIndex];
    }
    return '';
  }

  onWeightSelected(): void {
    const weightLimit = this.selectedParcelWeight;
    const selectedItemIndex = this.selectedItemsList.length - 1;

    if (weightLimit && selectedItemIndex !== null) {
      this.isParcelSelected = true;
    }
  }

}
