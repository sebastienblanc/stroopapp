export interface IStroopsub {
  id: number;
  name?: string | null;
  amount?: number | null;
  description?: string | null;
}

export type NewStroopsub = Omit<IStroopsub, 'id'> & { id: null };
