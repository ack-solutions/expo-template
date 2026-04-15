import { randomUUID } from 'expo-crypto';

/** UUID helpers using Expo Crypto (works on native, web, and Hermes without extra polyfills). */
export class IdUtils {
  static create(): string {
    return randomUUID();
  }
}
