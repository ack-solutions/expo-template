import { randomUUID } from 'expo-crypto';

/** UUID v4 using Expo Crypto (works on native, web, and Hermes without extra polyfills). */
export function createId(): string {
  return randomUUID();
}
