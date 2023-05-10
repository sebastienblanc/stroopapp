import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../stroopsub.test-samples';

import { StroopsubFormService } from './stroopsub-form.service';

describe('Stroopsub Form Service', () => {
  let service: StroopsubFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StroopsubFormService);
  });

  describe('Service methods', () => {
    describe('createStroopsubFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStroopsubFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            amount: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });

      it('passing IStroopsub should create a new form with FormGroup', () => {
        const formGroup = service.createStroopsubFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            amount: expect.any(Object),
            description: expect.any(Object),
          })
        );
      });
    });

    describe('getStroopsub', () => {
      it('should return NewStroopsub for default Stroopsub initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createStroopsubFormGroup(sampleWithNewData);

        const stroopsub = service.getStroopsub(formGroup) as any;

        expect(stroopsub).toMatchObject(sampleWithNewData);
      });

      it('should return NewStroopsub for empty Stroopsub initial value', () => {
        const formGroup = service.createStroopsubFormGroup();

        const stroopsub = service.getStroopsub(formGroup) as any;

        expect(stroopsub).toMatchObject({});
      });

      it('should return IStroopsub', () => {
        const formGroup = service.createStroopsubFormGroup(sampleWithRequiredData);

        const stroopsub = service.getStroopsub(formGroup) as any;

        expect(stroopsub).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStroopsub should not enable id FormControl', () => {
        const formGroup = service.createStroopsubFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStroopsub should disable id FormControl', () => {
        const formGroup = service.createStroopsubFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
