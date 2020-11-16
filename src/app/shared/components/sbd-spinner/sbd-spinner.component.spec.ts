import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbdSpinnerComponent } from './sbd-spinner.component';

describe('SbdSpinnerComponent', () => {
  let component: SbdSpinnerComponent;
  let fixture: ComponentFixture<SbdSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbdSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbdSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
