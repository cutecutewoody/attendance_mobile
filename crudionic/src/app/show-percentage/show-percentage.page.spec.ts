import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPercentagePage } from './show-percentage.page';

describe('ShowPercentagePage', () => {
  let component: ShowPercentagePage;
  let fixture: ComponentFixture<ShowPercentagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPercentagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPercentagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
