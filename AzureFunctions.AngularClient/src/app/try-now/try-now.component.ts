import { Component } from '@angular/core';
import { GlobalStateService } from '../shared/services/global-state.service';

@Component({
    selector: 'try-now',
    templateUrl: './try-now.component.html',
    styleUrls: ['./try-now.component.scss']
})
export class TryNowComponent {
    public freeTrialUri: string;
    azureUri: string;

    constructor(private _globalStateService: GlobalStateService) {
        this.freeTrialUri = this._globalStateService.freeTrialUri;
        this.azureUri = this._globalStateService.azureUri;
    }

    trackLinkClick(buttonName: string) {
        this._globalStateService.trackLinkClick(buttonName);
    }
}
