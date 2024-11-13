import { DynamicModule } from '@nestjs/common';
import { FirebaseAuthOptions } from './firebase-auth.dto';
import { FirebaseAuthService } from './firebase-auth.service';
import { FIREBASE_AUTH_OPTIONS } from './firebase-auth.constants';

export type FirebaseAuthModuleOptions = {
  dev?: boolean;
  tenantId?: string;
};

export class FirebaseAuthModule {
  static forRoot(options: FirebaseAuthModuleOptions = {}): DynamicModule {
    const adminAuthOptions: FirebaseAuthOptions = {
      tenantId: options.tenantId,
    };

    const module: DynamicModule = {
      global: true,
      module: FirebaseAuthModule,
      providers: [
        {
          provide: FIREBASE_AUTH_OPTIONS,
          useValue: adminAuthOptions,
        },
      ],
      imports: [],
      exports: [FIREBASE_AUTH_OPTIONS],
    };

    // Disable firebase authentication functions for development
    // Any values besides `true` will enable it
    if (true !== options.dev) {
      module.providers?.push(FirebaseAuthService);
      module.exports?.push(FirebaseAuthService);
    }

    return module;
  }
}
