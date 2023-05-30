import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchParcelDataComponent } from './fetch-parcel-data.component';

describe('FetchParcelDataComponent', () => {
  let component: FetchParcelDataComponent;
  let fixture: ComponentFixture<FetchParcelDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FetchParcelDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FetchParcelDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
