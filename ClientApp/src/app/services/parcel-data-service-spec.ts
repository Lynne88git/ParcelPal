import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Parcel } from '../interfaces/parcel.interface';
import { ParcelDataService } from './parcel-data-service';

describe('ParcelDataService', () => {
  let service: ParcelDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ParcelDataService]
    });

    service = TestBed.inject(ParcelDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch parcels successfully', () => {
    const mockData = `5: (1, Item 1, 1, 10)
                      10: (2, Item 2, 2, 20)`;
    const expectedParcels: Parcel[] = [
      { weight: 5, items: [{ index: '1', name: 'Item 1', weight: 1, cost: '10' }], id: 0, sampleParcelWeight: 0 },
      { weight: 10, items: [{ index: '2', name: 'Item 2', weight: 2, cost: '20' }], id: 0, sampleParcelWeight: 0 }
    ];

    service.fetchParcels().subscribe((parcels) => {
      expect(parcels).toEqual(expectedParcels);
    });

    const request = httpMock.expectOne('https://gist.githubusercontent.com/Lynne88git/552c061f4ebe867b70f6bc2376653b02/raw/876ca05861ce3bed421e0970b24563dfdfeb7ca5/input.txt');
    expect(request.request.method).toBe('GET');
    request.flush(mockData);
  });
});
