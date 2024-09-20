import { TestBed } from '@angular/core/testing';

import { SearchFieldService } from './search-field.service';

describe('SearchFieldService', () => {
  let service: SearchFieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchFieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
