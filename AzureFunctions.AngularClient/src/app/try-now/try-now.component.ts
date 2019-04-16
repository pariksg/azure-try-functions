import { Component } from '@angular/core';
import { GlobalStateService, TryProgress } from '../shared/services/global-state.service';

@Component({
    selector: 'try-now',
    templateUrl: './try-now.component.html',
    styleUrls: ['./try-now.component.scss']
})
export class TryNowComponent {
    public freeTrialUri: string;

    constructor(
        private _globalStateService: GlobalStateService) {
        this.freeTrialUri = `${window.location.protocol}//azure.microsoft.com/${window.navigator.language}/free`;
    }

    launchFreeTrialPortal() {
        this._globalStateService.tryProgress = TryProgress.FreeTrialClicked;
        this._globalStateService.trackLinkClick("freeTrialTopClick");
    }
}
