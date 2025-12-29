## 1. Rust Implementation

- [x] 1.1 Add `shutdown()` function to `src/lib.rs` that calls `client::drop_client()`
- [x] 1.2 Mark the `shutdown()` function with `#[napi]` attribute for JavaScript exposure
- [x] 1.3 Verify the function has proper error handling (no-op when no client exists)
- [x] 1.4 Run `cargo build` to verify Rust compilation

## 2. TypeScript Definitions

- [x] 2.1 Add `shutdown(): void` function declaration to `client.d.ts`
- [x] 2.2 Add JSDoc comment documenting the shutdown behavior
- [x] 2.3 Run TypeScript type checking to verify definitions are correct

## 3. Testing

- [x] 3.4 Create test case for `init()` -> `shutdown()` -> `init()` sequence
