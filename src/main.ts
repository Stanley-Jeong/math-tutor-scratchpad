import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import './assets/math-tutor-htmlelement-stan/components/math-tutor-scratch-pad.js';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
