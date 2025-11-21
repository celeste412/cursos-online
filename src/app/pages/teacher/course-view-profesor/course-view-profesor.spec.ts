import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseViewProfesor } from './course-view-profesor';

describe('CourseViewProfesor', () => {
  let component: CourseViewProfesor;
  let fixture: ComponentFixture<CourseViewProfesor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseViewProfesor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseViewProfesor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
