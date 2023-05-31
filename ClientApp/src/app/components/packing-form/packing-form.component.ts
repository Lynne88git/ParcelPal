import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from '../../interfaces/item.interface';
import { Parcel } from '../../interfaces/parcel.interface';
import { ParcelDataService } from '../../services/parcel-data-service';

@Component({
  selector: 'app-packing-form',
  templateUrl: './packing-form.component.html',
  styleUrls: ['./packing-form.component.css']
})
export class PackingFormComponent implements OnInit {
  packingForm: FormGroup = new FormGroup({});
  availableItems: Item[] = []; // Update this with the items from input.txt
  sampleParcelWeights: number[] = []; // Update this with the sample parcel weights from input.txt
  selectedItems: { weight: number, items: Item[] }[] = [];
  selectedItem: Item | null = null; // Update this line to store the selected item
  itemsByWeight: Record<number, any[]> = {};
  selectedItemsList: any[] = []; // Keeping the values in the 'your selection'
  showWeightError = false;
  isParcelSelected = false;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private parcelDataService: ParcelDataService) { }

  ngOnInit(): void {
    this.initForm();
    this.parcelDataService.fetchParcels().subscribe(
      (parcels: Parcel[]) => {
        this.parseInputData(parcels);
        this.updateItemsByWeight();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  initForm(): void {
    this.packingForm = this.fb.group({
      weightLimit: ['', Validators.required],
      items: this.fb.array([])
    });

    this.packingForm.get('weightLimit')?.valueChanges.subscribe((selectedWeight) => {
      this.filterItemsByWeight(selectedWeight);
    });
  }

  get items(): FormArray {
    return this.packingForm.get('items') as FormArray;
  }

  createItemGroup(item: Item): FormGroup {
    return this.fb.group({
      index: [item.index, Validators.required],
      weight: [`${item.weight}kg`],
      cost: [`${item.cost}`]
    });
  }

  addItem(): void {
    const selectedWeight = this.packingForm.get('weightLimit')?.value;
    if (selectedWeight) {
    const emptyItem: Item = { index: '', name: '', weight: 0, cost: '' };
      this.items.push(this.createItemGroup(emptyItem));
    } else {
      // Display an error message or perform any desired action
      this.showWeightError = true; // Set the error flag to display the message
      console.log('Please select a parcel/box weight before adding an item.');
    }
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  filterItemsByWeight(selectedWeight: number): void {
    const selectedItems = this.selectedItems.find(item => item.weight === selectedWeight);
    if (selectedItems) {
      this.availableItems = selectedItems.items;
    } else {
      this.availableItems = [];
    }
  }

  parseInputData(parcels: Parcel[]): void {
    for (const parcel of parcels) {
      this.sampleParcelWeights.push(parcel.weight);
      this.selectedItems.push({ weight: parcel.weight, items: parcel.items });

      this.itemsByWeight[parcel.weight] = parcel.items.map((item) => ({
        value: { index: item.index, name: item.name, weight: item.weight, cost: item.cost },
        label: `${item.index}, ${item.name}`,
        weight: `${item.weight}kg`,
        cost: `${item.cost}`
      }));
    }
  }


  updateItemsByWeight(): void {
    for (const { weight, items } of this.selectedItems) {
      this.itemsByWeight[weight] = items.map((item) => ({
        value: { index: item.index, name: item.name, weight: item.weight, cost: item.cost },
        label: `${item.index}, ${item.name}`,
        weight: `${item.weight}kg`,
        cost: `${item.cost}`,
        selectedItem: false // Add a new property to track selection
      }));
    }
  }

  addItemToParcel(item: any) {
    this.selectedItem = item.value; // Get the selected item values from the form
    console.log('Selected Item:', item.value);
    this.selectedItemsList.push(item.value);
    console.log('Selected Item:', item.value.name);
  // Process the selected items and add them to the sample parcel box
  // ...
}


  submitForm(): void {
    if (this.packingForm.valid) {
      const formValue = this.packingForm.value;
      console.log(formValue);
    }
  }

  onWeightSelected(): void {
    const weightLimit = this.packingForm.get('weightLimit')?.value;
    const selectedItemIndex = this.packingForm.get('items')?.value[this.items.controls.length - 1]?.index;

    if (weightLimit && selectedItemIndex !== null) {
      const selectedItems = this.itemsByWeight[weightLimit];
      const selectedItem = selectedItems.find(item => item.value === selectedItemIndex);

      if (selectedItem) {
        this.selectedItem = selectedItem;
        this.isParcelSelected = true;
      }
    }
  }

}
