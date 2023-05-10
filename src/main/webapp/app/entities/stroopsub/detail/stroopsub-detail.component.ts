import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStroopsub } from '../stroopsub.model';

@Component({
  selector: 'jhi-stroopsub-detail',
  templateUrl: './stroopsub-detail.component.html',
})
export class StroopsubDetailComponent implements OnInit {
  stroopsub: IStroopsub | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stroopsub }) => {
      this.stroopsub = stroopsub;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
