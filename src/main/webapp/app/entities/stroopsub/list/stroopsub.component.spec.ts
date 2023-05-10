import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StroopsubService } from '../service/stroopsub.service';

import { StroopsubComponent } from './stroopsub.component';

describe('Stroopsub Management Component', () => {
  let comp: StroopsubComponent;
  let fixture: ComponentFixture<StroopsubComponent>;
  let service: StroopsubService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'stroopsub', component: StroopsubComponent }]), HttpClientTestingModule],
      declarations: [StroopsubComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(StroopsubComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StroopsubComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StroopsubService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.stroopsubs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to stroopsubService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getStroopsubIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStroopsubIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
