import { Component } from "@angular/core";
import { GlobalStateService, TryProgress } from "app/shared/services/global-state.service";

@Component({
  selector: "try-progress",
  templateUrl: "./try-progress.component.html",
  styleUrls: ["./try-progress.component.scss"]
})
export class TryProgressComponent {
  TryProgress = TryProgress;
  constructor(private _globalStateService: GlobalStateService) {
  }

  public state() {
    return this._globalStateService.tryProgress;
  }
}
