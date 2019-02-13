import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FoiRouterService } from 'src/app/foi-router.service';

@Component({
  selector: 'foi-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  @Output() continue = new EventEmitter();
  @Output() goBack = new EventEmitter();
  @Input('showButtons') showButtons: boolean = true;
  @Input('continueText') continueText: String = 'Continue';

  constructor(private foiRouter: FoiRouterService) {}

  ngOnInit() {}

  /**
   * Handle navigation button clicks.
   * Issue the goBack event, the host component can call goFoiBack to actually
   * make the change.
   * If validation errors are present on the host component then
   * they need to be handled first.
   * It is the responsibility of the host component to persist any form data.
   */
  requestGoBack() {
    this.goBack.emit();
  }

  requestGoForward() {
    this.continue.emit();
  }

  goFoiBack() {
    this.foiRouter.progress({ direction: -1 });
  }

  goFoiForward() {
    this.foiRouter.progress({ direction: 1 });
  }
}
