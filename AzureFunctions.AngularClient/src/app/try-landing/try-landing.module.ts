import { TryLandingComponent } from './try-landing.component';
import { SharedModule } from './../shared/shared.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RecaptchaModule, RecaptchaLoaderService } from "ng-recaptcha";

const routing: ModuleWithProviders = RouterModule.forChild([
    { path: '', component: TryLandingComponent }
]);

@NgModule({
    imports: [
        TranslateModule.forChild(),
        SharedModule,
        routing,
        RecaptchaModule
    ],
    declarations: [
        TryLandingComponent
    ],
    providers: [RecaptchaLoaderService]
})
export class TryLandingModule { }
