// Re-export all types from client.d.ts
export type * from './client.d';
export function init(appId?: number): Omit<Client, "init" | "runCallbacks" | "shutdown">;
export function shutdown(): void;
export function isConnected(): boolean;
export function restartAppIfNecessary(appId: number): boolean;
export function electronEnableSteamOverlay(disableEachFrameInvalidation?: boolean): void;
export type Client = typeof import("./client.d");
export const SteamCallback: typeof import("./client.d").callback.SteamCallback;
