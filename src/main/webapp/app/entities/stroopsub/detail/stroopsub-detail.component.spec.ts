import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StroopsubDetailComponent } from './stroopsub-detail.component';

describe('Stroopsub Management Detail Component', () => {
  let comp: StroopsubDetailComponent;
  let fixture: ComponentFixture<StroopsubDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StroopsubDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ stroopsub: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StroopsubDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StroopsubDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load stroopsub on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.stroopsub).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
