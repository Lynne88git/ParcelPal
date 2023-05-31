import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PackingFormComponent } from './packing-form.component';
import { Parcel } from '../../interfaces/parcel.interface';


describe('PackingFormComponent', () => {
  let component: PackingFormComponent;
  let fixture: ComponentFixture<PackingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackingFormComponent],
      imports: [ReactiveFormsModule, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    const form = component.packingForm;
    expect(form.get('weightLimit')).toBeTruthy();
    expect(form.get('items')).toBeTruthy();
  });

  it('should add an item to the form', () => {
    const initialItemsLength = component.items.length;
    component.addItem();
    expect(component.items.length).toBe(initialItemsLength + 1);
  });

  it('should remove an item from the form', () => {
    const initialItemsLength = component.items.length;
    component.removeItem(0);
    expect(component.items.length).toBe(initialItemsLength - 1);
  });

  it('should filter items by weight when weight limit changes', () => {
    const selectedWeight = 10; // Set a weight value from your available weights
    component.filterItemsByWeight(selectedWeight);
    expect(component.availableItems.length).toBeGreaterThan(0);
  });

  it('should parse input data and update items by weight', () => {
    const mockParcels: Parcel[] = [
      { id: 1, weight: 5, sampleParcelWeight: 5, items: [{ index: '1', name: 'Item 1', weight: 1, cost: '10' }] },
      { id: 2, weight: 10, sampleParcelWeight: 10, items: [{ index: '2', name: 'Item 2', weight: 2, cost: '20' }] },
    ];
    component.parseInputData(mockParcels);
    expect(component.sampleParcelWeights).toEqual([5, 10]);
    expect(component.selectedItems).toEqual([
      { weight: 5, items: [{ index: '1', name: 'Item 1', weight: 1, cost: '10' }] },
      { weight: 10, items: [{ index: '2', name: 'Item 2', weight: 2, cost: '20' }] },
    ]);
    expect(component.itemsByWeight).toEqual({
      5: [
        {
          value: { index: '1', name: 'Item 1', weight: 1, cost: '10' },
          label: '1, Item 1',
          weight: '1kg',
          cost: '10',
        },
      ],
      10: [
        {
          value: { index: '2', name: 'Item 2', weight: 2, cost: '20' },
          label: '2, Item 2',
          weight: '2kg',
          cost: '20',
        },
      ],
    });
  });

  // Add more tests as needed

});
