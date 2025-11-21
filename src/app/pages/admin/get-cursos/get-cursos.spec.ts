import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetCursos } from './get-cursos';

describe('GetCursos', () => {
  let component: GetCursos;
  let fixture: ComponentFixture<GetCursos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetCursos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetCursos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
