import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-packing-form',
  templateUrl: './packing-form.component.html',
  styleUrls: ['./packing-form.component.css']
})
export class PackingFormComponent implements OnInit {
  packingForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.packingForm = this.fb.group({
      weightLimit: ['', Validators.required],
      items: this.fb.array([])
    });
  }

  get items(): FormArray {
    return this.packingForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      weight: ['', Validators.required],
      cost: ['', Validators.required]
    });

    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  submitForm(): void {
    if (this.packingForm.valid) {
      // TODO: Implement the logic to send the form data to the server
      const formValue = this.packingForm.value;
      console.log(formValue);
    }
  }
}
