import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgresoEstudiante } from './progreso-estudiante';

describe('ProgresoEstudiante', () => {
  let component: ProgresoEstudiante;
  let fixture: ComponentFixture<ProgresoEstudiante>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgresoEstudiante]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgresoEstudiante);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
