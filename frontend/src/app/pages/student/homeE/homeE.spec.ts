import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeE } from './homeE';

describe('Home', () => {
  let component: HomeE;
  let fixture: ComponentFixture<HomeE>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeE]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeE);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
