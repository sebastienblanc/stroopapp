import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStroopsub } from '../stroopsub.model';
import { StroopsubService } from '../service/stroopsub.service';

@Injectable({ providedIn: 'root' })
export class StroopsubRoutingResolveService implements Resolve<IStroopsub | null> {
  constructor(protected service: StroopsubService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStroopsub | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((stroopsub: HttpResponse<IStroopsub>) => {
          if (stroopsub.body) {
            return of(stroopsub.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
