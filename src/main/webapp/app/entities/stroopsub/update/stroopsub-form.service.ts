import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStroopsub, NewStroopsub } from '../stroopsub.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStroopsub for edit and NewStroopsubFormGroupInput for create.
 */
type StroopsubFormGroupInput = IStroopsub | PartialWithRequiredKeyOf<NewStroopsub>;

type StroopsubFormDefaults = Pick<NewStroopsub, 'id'>;

type StroopsubFormGroupContent = {
  id: FormControl<IStroopsub['id'] | NewStroopsub['id']>;
  name: FormControl<IStroopsub['name']>;
  amount: FormControl<IStroopsub['amount']>;
  description: FormControl<IStroopsub['description']>;
};

export type StroopsubFormGroup = FormGroup<StroopsubFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StroopsubFormService {
  createStroopsubFormGroup(stroopsub: StroopsubFormGroupInput = { id: null }): StroopsubFormGroup {
    const stroopsubRawValue = {
      ...this.getFormDefaults(),
      ...stroopsub,
    };
    return new FormGroup<StroopsubFormGroupContent>({
      id: new FormControl(
        { value: stroopsubRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(stroopsubRawValue.name),
      amount: new FormControl(stroopsubRawValue.amount),
      description: new FormControl(stroopsubRawValue.description),
    });
  }

  getStroopsub(form: StroopsubFormGroup): IStroopsub | NewStroopsub {
    return form.getRawValue() as IStroopsub | NewStroopsub;
  }

  resetForm(form: StroopsubFormGroup, stroopsub: StroopsubFormGroupInput): void {
    const stroopsubRawValue = { ...this.getFormDefaults(), ...stroopsub };
    form.reset(
      {
        ...stroopsubRawValue,
        id: { value: stroopsubRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): StroopsubFormDefaults {
    return {
      id: null,
    };
  }
}
