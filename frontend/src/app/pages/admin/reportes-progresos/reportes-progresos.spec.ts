import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesProgresos } from './reportes-progresos';

describe('ReportesProgresos', () => {
  let component: ReportesProgresos;
  let fixture: ComponentFixture<ReportesProgresos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesProgresos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportesProgresos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
