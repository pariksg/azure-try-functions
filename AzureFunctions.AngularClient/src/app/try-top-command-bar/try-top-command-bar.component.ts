import { Component, OnInit } from '@angular/core';
import { BroadcastService } from '../shared/services/broadcast.service';
import { BroadcastEvent } from '../shared/models/broadcast-event';
import { TryFunctionsService } from '../shared/services/try-functions.service';
import { TranslateService } from '@ngx-translate/core';
import { PortalResources } from '../shared/models/portal-resources';
import { GlobalStateService, TryProgress } from '../shared/services/global-state.service';
import { AiService } from '../shared/services/ai.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Constants } from 'app/shared/models/constants';
import { FileUtilities } from 'app/shared/Utilities/file';
import { FunctionAppService } from 'app/shared/services/function-app.service';

@Component({
    selector: 'try-top-command-bar',
    templateUrl: './try-top-command-bar.component.html',
    styleUrls: ['./try-top-command-bar.component.scss']
})
export class TryTopCommandBarComponent implements OnInit {
    private endTime: Date;

    public freeTrialUri: string;
    public timerText: string;
    public discoverMoreUri: string;
    public showTryRestartModal = false;

    constructor(private _functionsService: TryFunctionsService,
        private _functionAppService: FunctionAppService,
        private _broadcastService: BroadcastService,
        private _globalStateService: GlobalStateService,
        private _translateService: TranslateService,
        private _aiService: AiService) {
        // TODO: [fashaikh] Add cookie referer details like in try
        this.freeTrialUri = `${window.location.protocol}//azure.microsoft.com/${window.navigator.language}/free`;
        this.discoverMoreUri = `${window.location.protocol}//azure.microsoft.com/${window.navigator.language}/services/functions/`;

        const callBack = () => {
            window.setTimeout(() => {
                let mm;
                const now = new Date();

                const msLeft = this.endTime.getTime() - now.getTime();
                if (this.endTime >= now) {
                    // http://stackoverflow.com/questions/1787939/check-time-difference-in-javascript
                    mm = Math.floor(msLeft / 1000 / 60);
                    if (mm < 1) {
                        this.timerText = (this._translateService.instant(PortalResources.tryNow_lessThanOneMinute));
                    } else {
                        this.timerText = this.pad(mm, 2) + ' ' + this._translateService.instant(PortalResources.tryNow_minutes);
                    }
                    window.setTimeout(callBack, 1000);
                } else {
                    this.timerText = this._translateService.instant(PortalResources.tryNow_trialExpired);
                    this._globalStateService.TrialExpired = true;
                    this._globalStateService.TryAppServiceToken = null;
                    Cookie.delete('TryAppServiceToken');
                    Cookie.delete('functionName');
                    Cookie.delete('provider');
                    Cookie.delete('templateId');
                    this._broadcastService.broadcast(BroadcastEvent.TrialExpired);
                }
            });
        };

        this._functionsService.getTrialResource()
            .subscribe((resource) => {
                this.endTime = new Date();
                this.endTime.setSeconds(this.endTime.getSeconds() + resource.timeLeft);
                callBack();
            });
    }

    ngOnInit() { }

    // http://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
    pad(n, width) {
        const z = '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    downloadFunctionAppContent() {
        this._globalStateService.setBusyState();
        this._aiService.trackEvent("download-function");

        this._functionAppService
            .getAppContentAsZip(this._functionsService.functionAppContext)
            .subscribe(
            data => {
                if (data.isSuccessful) {
                    FileUtilities.saveFile(
                        data.result,
                        `${this._functionsService.functionAppContext.site.name}.zip`
                    );
                }
                this._globalStateService.clearBusyState();
            },
            () => this._globalStateService.clearBusyState()
            );
    }

    showRestartModal() {
        this.showTryRestartModal = true;
    }

    hideModal() {
        this.showTryRestartModal = false;
    }

    deleteFunctionApp() {
        this._globalStateService.setBusyState();
        this._globalStateService.tryProgress = TryProgress.NotStarted;
        this._aiService.trackEvent("delete-function");
        this._functionsService.deleteTrialResource().subscribe(
            () => {
                this._globalStateService.TrialExpired = true;
                this._broadcastService.broadcast(BroadcastEvent.TrialExpired);
                this._globalStateService.clearBusyState();
                window.location.href = `${Constants.serviceHost}try`;
            },
            error => {
                this._globalStateService.clearBusyState();
            }
        );
    }

    trackLinkClick(buttonName: string) {
        this._globalStateService.trackLinkClick(buttonName);
    }
}
