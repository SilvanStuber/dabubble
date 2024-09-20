import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({ "projectId": "dabubble-silvan", "appId": "1:135313102109:web:c8cb5445e180527da57df4", "storageBucket": "dabubble-silvan.appspot.com", "apiKey": "AIzaSyBL92JtRX0v4kJvmLcKc_jtyb_QJxbIqW4", "authDomain": "dabubble-silvan.firebaseapp.com", "messagingSenderId": "135313102109" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
  ]
};
