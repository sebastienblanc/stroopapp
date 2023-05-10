import { IStroopsub, NewStroopsub } from './stroopsub.model';

export const sampleWithRequiredData: IStroopsub = {
  id: 86218,
};

export const sampleWithPartialData: IStroopsub = {
  id: 60945,
  name: 'Salad',
  amount: 44039,
};

export const sampleWithFullData: IStroopsub = {
  id: 83784,
  name: 'system programming Plastic',
  amount: 56339,
  description: 'Operations purple HTTP',
};

export const sampleWithNewData: NewStroopsub = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
