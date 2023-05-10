import dayjs from 'dayjs/esm';

import { Offers } from 'app/entities/enumerations/offers.model';

import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 47761,
};

export const sampleWithPartialData: IOrder = {
  id: 69128,
  offer: Offers['MEDIUM'],
  startDate: dayjs('2023-01-23'),
};

export const sampleWithFullData: IOrder = {
  id: 56605,
  name: 'Handcrafted Account Ville',
  offer: Offers['LARGE'],
  startDate: dayjs('2023-01-22'),
};

export const sampleWithNewData: NewOrder = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
