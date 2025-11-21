import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavProfesor } from './nav-profesor';

describe('NavProfesor', () => {
  let component: NavProfesor;
  let fixture: ComponentFixture<NavProfesor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavProfesor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavProfesor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
