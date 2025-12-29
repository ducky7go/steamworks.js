// Re-export all types from client.d.ts
export type * from './client.d';

export function init(appId?: number): Omit<typeof import('./client.d'), 'init' | 'runCallbacks'>;
export function restartAppIfNecessary(appId: number): boolean;
export function electronEnableSteamOverlay(disableEachFrameInvalidation?: boolean): void;
export const SteamCallback: typeof import('./client.d').callback.SteamCallback;
