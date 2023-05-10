import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStroopsub, NewStroopsub } from '../stroopsub.model';

export type PartialUpdateStroopsub = Partial<IStroopsub> & Pick<IStroopsub, 'id'>;

export type EntityResponseType = HttpResponse<IStroopsub>;
export type EntityArrayResponseType = HttpResponse<IStroopsub[]>;

@Injectable({ providedIn: 'root' })
export class StroopsubService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stroopsubs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(stroopsub: NewStroopsub): Observable<EntityResponseType> {
    return this.http.post<IStroopsub>(this.resourceUrl, stroopsub, { observe: 'response' });
  }

  update(stroopsub: IStroopsub): Observable<EntityResponseType> {
    return this.http.put<IStroopsub>(`${this.resourceUrl}/${this.getStroopsubIdentifier(stroopsub)}`, stroopsub, { observe: 'response' });
  }

  partialUpdate(stroopsub: PartialUpdateStroopsub): Observable<EntityResponseType> {
    return this.http.patch<IStroopsub>(`${this.resourceUrl}/${this.getStroopsubIdentifier(stroopsub)}`, stroopsub, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStroopsub>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStroopsub[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStroopsubIdentifier(stroopsub: Pick<IStroopsub, 'id'>): number {
    return stroopsub.id;
  }

  compareStroopsub(o1: Pick<IStroopsub, 'id'> | null, o2: Pick<IStroopsub, 'id'> | null): boolean {
    return o1 && o2 ? this.getStroopsubIdentifier(o1) === this.getStroopsubIdentifier(o2) : o1 === o2;
  }

  addStroopsubToCollectionIfMissing<Type extends Pick<IStroopsub, 'id'>>(
    stroopsubCollection: Type[],
    ...stroopsubsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const stroopsubs: Type[] = stroopsubsToCheck.filter(isPresent);
    if (stroopsubs.length > 0) {
      const stroopsubCollectionIdentifiers = stroopsubCollection.map(stroopsubItem => this.getStroopsubIdentifier(stroopsubItem)!);
      const stroopsubsToAdd = stroopsubs.filter(stroopsubItem => {
        const stroopsubIdentifier = this.getStroopsubIdentifier(stroopsubItem);
        if (stroopsubCollectionIdentifiers.includes(stroopsubIdentifier)) {
          return false;
        }
        stroopsubCollectionIdentifiers.push(stroopsubIdentifier);
        return true;
      });
      return [...stroopsubsToAdd, ...stroopsubCollection];
    }
    return stroopsubCollection;
  }
}
