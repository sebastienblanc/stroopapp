import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StroopsubFormService } from './stroopsub-form.service';
import { StroopsubService } from '../service/stroopsub.service';
import { IStroopsub } from '../stroopsub.model';

import { StroopsubUpdateComponent } from './stroopsub-update.component';

describe('Stroopsub Management Update Component', () => {
  let comp: StroopsubUpdateComponent;
  let fixture: ComponentFixture<StroopsubUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stroopsubFormService: StroopsubFormService;
  let stroopsubService: StroopsubService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StroopsubUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(StroopsubUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StroopsubUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stroopsubFormService = TestBed.inject(StroopsubFormService);
    stroopsubService = TestBed.inject(StroopsubService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const stroopsub: IStroopsub = { id: 456 };

      activatedRoute.data = of({ stroopsub });
      comp.ngOnInit();

      expect(comp.stroopsub).toEqual(stroopsub);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStroopsub>>();
      const stroopsub = { id: 123 };
      jest.spyOn(stroopsubFormService, 'getStroopsub').mockReturnValue(stroopsub);
      jest.spyOn(stroopsubService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stroopsub });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stroopsub }));
      saveSubject.complete();

      // THEN
      expect(stroopsubFormService.getStroopsub).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(stroopsubService.update).toHaveBeenCalledWith(expect.objectContaining(stroopsub));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStroopsub>>();
      const stroopsub = { id: 123 };
      jest.spyOn(stroopsubFormService, 'getStroopsub').mockReturnValue({ id: null });
      jest.spyOn(stroopsubService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stroopsub: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stroopsub }));
      saveSubject.complete();

      // THEN
      expect(stroopsubFormService.getStroopsub).toHaveBeenCalled();
      expect(stroopsubService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStroopsub>>();
      const stroopsub = { id: 123 };
      jest.spyOn(stroopsubService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stroopsub });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stroopsubService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
