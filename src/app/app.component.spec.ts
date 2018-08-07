import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { MatToolbarModule } from '@angular/material';
import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  template: ''
})
export class UsersMockComponent {}

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        UsersMockComponent
      ],
      imports: [
        MatToolbarModule
      ]
    }).compileComponents();
  }));

  it('should create the app component', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
