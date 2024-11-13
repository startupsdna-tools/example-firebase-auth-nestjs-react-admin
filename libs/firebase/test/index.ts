import { App } from 'firebase-admin/app';
import { Auth } from 'firebase-admin/auth';
import { Storage } from 'firebase-admin/storage';
import { createMock } from '@golevelup/ts-jest';
import { TestBuilderPlugin, TestingModuleBuilderHelper } from '@app/testing';
import { FIREBASE_APP } from '../src';

export const mockFirebaseApp = createMock<App>();
export const mockFirebaseAuth = createMock<Auth>();
export const mockFirebaseStorage = createMock<Storage>();

export function mockFirebase(): TestBuilderPlugin {
  return {
    apply(builder: TestingModuleBuilderHelper) {
      builder.overrideProvider(FIREBASE_APP, mockFirebaseApp);
      builder.overrideProvider(Auth, mockFirebaseAuth);
      builder.overrideProvider(Storage, mockFirebaseStorage);
    },
  };
}
