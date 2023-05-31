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
  // Declare property to store the selected parcel weight to use onSubmit
  selectedParcelWeight: number | undefined;
  // Error regarding the total weight limit exceeded for parcel
  showWeightLimitError = false;

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
  // Adds the selected sample parcel not the items in it
  addItem(): void {
    const selectedWeight = this.packingForm.get('weightLimit')?.value;
    if (selectedWeight) {
    const emptyItem: Item = { index: '', name: '', weight: 0, cost: '' };
      this.items.push(this.createItemGroup(emptyItem));
      this.selectedParcelWeight = selectedWeight; // Assign the selected parcel weight

      console.log('Selected Parcel Weight:', selectedWeight);

    } else {
      // Display an error message 
      this.showWeightError = true; // Set the error flag to display the message
      console.log('Please select a parcel/box weight before adding an item.');
    }
  }

  removeItem(selectedItem: any): void {
    const index = this.selectedItemsList.indexOf(selectedItem);
    if (index !== -1) {
      this.selectedItemsList.splice(index, 1); // Remove the item from the selectedItemsList
      console.log('Selected Items:', this.selectedItemsList); // Log the updated selectedItemsList
    }
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

  // Adds actual items to your parcel
  addItemToParcel(item: any): void {
    if (item) {
      const selectedItem = {
        index: item.value.index,
        name: item.value.name,
        weight: item.value.weight,
        cost: item.value.cost
      };
      this.selectedItemsList.push(selectedItem);
      console.log('Selected Item:', selectedItem);
    }
  }
  // Check the total weight of the items before submit
  calculateTotalWeight(): number {
    let totalWeight = 0;
    for (const selectedItem of this.selectedItemsList) {
      totalWeight += selectedItem.weight;
    }
    return totalWeight;
  }


  submitForm(): void {
    // Check the weight limit using the selected parcel weight
    if (this.packingForm.valid) {
      const formValue = this.packingForm.value;
      console.log(formValue);
    }
    // Calculate the total weight and cost of selected items
    let totalWeight = 0;
    let totalCost = 0;
    for (const selectedItem of this.selectedItemsList) {
      totalWeight += selectedItem.weight;
      totalCost += selectedItem.cost;
    }

    const errors: string[] = [];

    if (totalCost > 100) {
      errors.push('Total cost of items exceeds 100 euro.');
    } else {
      // Proceed with form submission
      console.log('Form submitted successfully!');
    }

    if (this.selectedParcelWeight && totalWeight > this.selectedParcelWeight) {
      this.showWeightLimitError = true;
      console.log('Weight limit exceeded!');
    } else {
      // Proceed with form submission
      console.log('Form submitted successfully!');
    }

    if (errors.length > 0) {
      // Display errors to the user (e.g., show an alert or update an error message on the form)
      console.log('Validation Errors:', errors);
    } else {
      // Proceed with form submission
      console.log('Form submitted successfully!');
      // Reset the selected items list or perform any other actions
      this.selectedItemsList = [];
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
        this.selectedItemsList.push(selectedItem.value); // Add the selected item to the selectedItemsList
        console.log('Selected Items:', this.selectedItemsList); // Log the selectedItemsList
        this.isParcelSelected = true;
      }
    }
  }

}
