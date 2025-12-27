// Re-export all types from client.d.ts
export type * from './client.d';

// Re-export commonly used types from nested namespaces for convenience
export type { PlayerSteamId, workshop, auth, cloud, input, localplayer, matchmaking, networking, overlay, stats, utils, callback, achievement, apps } from './client.d';

export function init(appId?: number): Omit<typeof import('./client.d'), 'init' | 'runCallbacks'>;
export function restartAppIfNecessary(appId: number): boolean;
export function electronEnableSteamOverlay(disableEachFrameInvalidation?: boolean): void;
export const SteamCallback: typeof import('./client.d').callback.SteamCallback;
