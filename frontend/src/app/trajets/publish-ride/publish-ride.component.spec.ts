import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishRideComponent } from './publish-ride.component';

describe('PublishRideComponent', () => {
  let component: PublishRideComponent;
  let fixture: ComponentFixture<PublishRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishRideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
