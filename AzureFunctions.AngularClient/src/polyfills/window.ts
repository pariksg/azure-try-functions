import 'core-js/es6/symbol';
import { FunctionsVersionInfo } from '../app/shared/models/functions-version-info';

interface Environment {
  hostName: string;
  runtimeType: 'OnPrem' | 'Azure' | 'Standalone';
  azureResourceManagerEndpoint: string;
  tryAppServiceUrl: string;
  reCAPTCHASiteKey: string;
}

interface AppSvc {
  env: Environment;
  functionsVersionInfo: FunctionsVersionInfo;
}

declare global {
  interface Window {
    appsvc: AppSvc;
  }
}
