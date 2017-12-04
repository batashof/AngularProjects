import { TestBed, inject } from '@angular/core/testing';

import { GridDataService } from './griddata.service';

describe('GridDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridDataService]
    });
  });

  it('should be created', inject([GridDataService], (service: GridDataService) => {
    expect(service).toBeTruthy();
  }));
});
