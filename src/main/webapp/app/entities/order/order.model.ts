import dayjs from 'dayjs/esm';
import { Offers } from 'app/entities/enumerations/offers.model';

export interface IOrder {
  id: number;
  name?: string | null;
  offer?: Offers | null;
  startDate?: dayjs.Dayjs | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
