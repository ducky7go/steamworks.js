# Change: 支持断开Steam链接 (Support Steam Disconnect)

## Why

当前系统已支持Steam游戏连接功能（通过 `init()` 函数初始化Steam客户端），但缺少断开连接的能力。这导致：
- 已连接的Steam游戏会话无法主动终止
- 应用程序无法优雅地关闭Steam连接
- 测试和开发过程中无法重置Steam连接状态

The current system supports Steam game connection (via `init()` function), but lacks the ability to disconnect. This leads to:
- Connected Steam game sessions cannot be actively terminated
- Applications cannot gracefully shut down Steam connections
- Steam connection state cannot be reset during testing and development

底层 `steamworks-rs` 库已通过 `Drop` trait 实现了 `SteamAPI_Shutdown()`，当前代码已有 `drop_client()` 函数但未暴露给JavaScript层。

The underlying `steamworks-rs` library already implements `SteamAPI_Shutdown()` via the `Drop` trait, and the current code has a `drop_client()` function that is not exposed to the JavaScript layer.

## What Changes

- Add a new `shutdown()` function to the public API for disconnecting the Steam client
- Expose the existing `drop_client()` functionality as a public JavaScript function
- Update TypeScript definitions to include the new `shutdown()` function
- Add proper documentation for the shutdown functionality

**Breaking Changes**: None - this is purely additive. Existing code continues to work as before.

## Impact

- Affected specs: `client-lifecycle` (new capability)
- Affected code:
  - `src/lib.rs` - Add `shutdown()` function exposed via N-API
  - `client.d.ts` - Update TypeScript definitions
  - Test coverage for the new shutdown functionality
