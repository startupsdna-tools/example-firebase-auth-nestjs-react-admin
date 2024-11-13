import { DynamicModule } from '@nestjs/common';
import { initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';
import { firebaseConfig, FirebaseConfigOptions } from './firebase.config';
import { FIREBASE_APP, FIREBASE_CONFIG } from './firebase.constants';

export type FirebaseModuleOptions = FirebaseConfigOptions;

export class FirebaseModule {
  static forRoot(options: FirebaseModuleOptions): DynamicModule {
    return {
      module: FirebaseModule,
      global: true,
      providers: [
        {
          provide: FIREBASE_CONFIG,
          useValue: firebaseConfig(options),
        },
        {
          provide: FIREBASE_APP,
          useFactory: (options) => initializeApp(options),
          inject: [FIREBASE_CONFIG],
        },
        {
          provide: Auth,
          useFactory: getAuth,
          inject: [FIREBASE_APP],
        },
        {
          provide: Storage,
          useFactory: getStorage,
          inject: [FIREBASE_APP],
        },
      ],
      exports: [FIREBASE_CONFIG, FIREBASE_APP, Auth, Storage],
    };
  }
}
