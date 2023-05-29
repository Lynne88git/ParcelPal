import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from '../interfaces/item.interface';


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

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.initForm();
    const filePath = 'assets/input.txt';
    this.http.get(filePath, { responseType: 'text' }).subscribe(
      (response) => {
        this.parseInputFile(response);// Parse the input.txt file and update availableItems and sampleParcelWeights arrays
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

  createItemGroup(): FormGroup {
    return this.fb.group({
      index: ['', Validators.required],
      weight: [{ value: '', disabled: true }],
      cost: [{ value: '', disabled: true }]
    });
  }

  addItem(): void {
    this.items.push(this.createItemGroup());
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

  parseInputFile(fileContent: string): void {
    console.log('File Content:', fileContent); // Log the file content to check if it's correctly loaded
    const lines = fileContent.split('\n');

    for (const line of lines) {
      if (line.trim() === '') {
        continue; // Skip empty lines
      }
      const [weightStr, itemsStr] = line.split(':');
      console.log('Weight:', weightStr.trim()); // Log the weight string
      console.log('Items:', itemsStr.trim()); // Log the items string
      const weight = +weightStr.trim();
      const items = itemsStr.split('(').slice(1).map((item) => {
        const [index, name, weightStr, costStr] = item.split(',').map((item) => item.trim().replace(')', ''));
        const weight = +weightStr.trim();
        const cost = +costStr.trim();
        return { index, name, weight, cost } as Item;
      });

      this.sampleParcelWeights.push(weight);
      this.selectedItems.push({ weight, items });

      // Updating the items dropdown options
      this.itemsByWeight[weight] = items.map((item) => ({
        value: item.index,
        label: `${item.index}, ${item.name}, ${item.weight}kg, €${item.cost}`
      }));
    }
  }

  submitForm(): void {
    if (this.packingForm.valid) {
      const formValue = this.packingForm.value;
      console.log(formValue);
    }
  }

  onWeightSelected(): void {
    this.selectedItem = null; // Reset selected item
  }
}
