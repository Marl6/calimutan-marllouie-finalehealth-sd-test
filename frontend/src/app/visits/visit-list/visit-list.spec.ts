import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitList } from './visit-list';

describe('VisitList', () => {
  let component: VisitList;
  let fixture: ComponentFixture<VisitList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
