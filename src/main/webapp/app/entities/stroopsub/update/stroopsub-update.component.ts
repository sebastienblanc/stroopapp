import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { StroopsubFormService, StroopsubFormGroup } from './stroopsub-form.service';
import { IStroopsub } from '../stroopsub.model';
import { StroopsubService } from '../service/stroopsub.service';

@Component({
  selector: 'jhi-stroopsub-update',
  templateUrl: './stroopsub-update.component.html',
})
export class StroopsubUpdateComponent implements OnInit {
  isSaving = false;
  stroopsub: IStroopsub | null = null;

  editForm: StroopsubFormGroup = this.stroopsubFormService.createStroopsubFormGroup();

  constructor(
    protected stroopsubService: StroopsubService,
    protected stroopsubFormService: StroopsubFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stroopsub }) => {
      this.stroopsub = stroopsub;
      if (stroopsub) {
        this.updateForm(stroopsub);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stroopsub = this.stroopsubFormService.getStroopsub(this.editForm);
    if (stroopsub.id !== null) {
      this.subscribeToSaveResponse(this.stroopsubService.update(stroopsub));
    } else {
      this.subscribeToSaveResponse(this.stroopsubService.create(stroopsub));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStroopsub>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(stroopsub: IStroopsub): void {
    this.stroopsub = stroopsub;
    this.stroopsubFormService.resetForm(this.editForm, stroopsub);
  }
}
