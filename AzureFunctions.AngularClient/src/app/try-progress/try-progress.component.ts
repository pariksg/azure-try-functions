import { Component, OnInit } from "@angular/core";
import { GlobalStateService } from "app/shared/services/global-state.service";

@Component({
  selector: "try-progress",
  templateUrl: "./try-progress.component.html",
  styleUrls: ["./try-progress.component.scss"]
})
export class TryProgressComponent implements OnInit {
  public state = 0;

  constructor(private _globalStateService: GlobalStateService) {
    this.state = this._globalStateService.tryProgress;
  }

  ngOnInit() {}
}
