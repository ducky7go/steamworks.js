# Change: Support List Return Children via setReturnChildren

## Why

The Steam Workshop API supports hierarchical data structures (e.g., collections containing child items), but the current implementation only returns the count of children (`numChildren`) without providing access to the actual child items. This requires applications to make additional API calls to fetch child data, resulting in:
- Multiple round trips to Steam for hierarchical data
- Increased complexity in client-side code
- Poor performance for deeply nested structures

The underlying Steamworks SDK already provides `setReturnChildren` and `getChildren` methods, but they are not exposed in the JavaScript API.

## What Changes

- Add `returnChildren` option to `WorkshopItemQueryConfig` interface
- Add `children` array property to `WorkshopItem` interface containing child `WorkshopItem` objects
- Implement `set_return_children` handling in Rust query configuration
- Implement recursive child fetching and population in result conversion
- Update TypeScript definitions for `WorkshopItem` and `WorkshopItemQueryConfig`

**Breaking Changes**: None - this is purely additive. Existing code continues to work as before.

## Impact

- Affected specs: `workshop-queries` (new capability to be added)
- Affected code:
  - `src/api/workshop_item.rs` - Add `return_children` to query config and children population
  - `src/api/workshop_item.rs` - Update `WorkshopItem` struct with `children` field
  - `client.d.ts` - Update TypeScript definitions
