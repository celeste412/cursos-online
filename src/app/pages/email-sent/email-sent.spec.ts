import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSent } from './email-sent';

describe('EmailSent', () => {
  let component: EmailSent;
  let fixture: ComponentFixture<EmailSent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailSent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailSent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
