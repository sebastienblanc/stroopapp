import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StroopsubComponent } from './list/stroopsub.component';
import { StroopsubDetailComponent } from './detail/stroopsub-detail.component';
import { StroopsubUpdateComponent } from './update/stroopsub-update.component';
import { StroopsubDeleteDialogComponent } from './delete/stroopsub-delete-dialog.component';
import { StroopsubRoutingModule } from './route/stroopsub-routing.module';

@NgModule({
  imports: [SharedModule, StroopsubRoutingModule],
  declarations: [StroopsubComponent, StroopsubDetailComponent, StroopsubUpdateComponent, StroopsubDeleteDialogComponent],
})
export class StroopsubModule {}
