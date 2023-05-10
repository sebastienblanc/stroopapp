import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStroopsub } from '../stroopsub.model';
import { StroopsubService } from '../service/stroopsub.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './stroopsub-delete-dialog.component.html',
})
export class StroopsubDeleteDialogComponent {
  stroopsub?: IStroopsub;

  constructor(protected stroopsubService: StroopsubService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.stroopsubService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
