import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StroopsubComponent } from '../list/stroopsub.component';
import { StroopsubDetailComponent } from '../detail/stroopsub-detail.component';
import { StroopsubUpdateComponent } from '../update/stroopsub-update.component';
import { StroopsubRoutingResolveService } from './stroopsub-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const stroopsubRoute: Routes = [
  {
    path: '',
    component: StroopsubComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StroopsubDetailComponent,
    resolve: {
      stroopsub: StroopsubRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StroopsubUpdateComponent,
    resolve: {
      stroopsub: StroopsubRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StroopsubUpdateComponent,
    resolve: {
      stroopsub: StroopsubRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(stroopsubRoute)],
  exports: [RouterModule],
})
export class StroopsubRoutingModule {}
