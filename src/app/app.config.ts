import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';

const ArcaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fff5f5',
      100: '#ffdad9',
      200: '#ffb3b2',
      300: '#fd8a80',
      400: '#e31d3b',
      500: '#ba0029',
      600: '#92001e',
      700: '#7f2925',
      800: '#410008',
      900: '#2d0006',
      950: '#1a0003',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#ba0029',
          contrastColor: '#ffffff',
          hoverColor: '#92001e',
          activeColor: '#410008',
        },
        highlight: {
          background: '#ffdad9',
          focusBackground: '#ffb3b2',
          color: '#92001e',
          focusColor: '#410008',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: ArcaPreset,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    provideCharts(withDefaultRegisterables()),
  ]
};
