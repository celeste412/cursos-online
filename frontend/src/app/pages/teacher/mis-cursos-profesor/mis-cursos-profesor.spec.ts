import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCursosProfesor } from './mis-cursos-profesor';

describe('MisCursosProfesor', () => {
  let component: MisCursosProfesor;
  let fixture: ComponentFixture<MisCursosProfesor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisCursosProfesor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisCursosProfesor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
