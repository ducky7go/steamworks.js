## 1. Rust Implementation

- [x] 1.1 Add `return_children: Option<bool>` field to `WorkshopItemQueryConfig` struct in `src/api/workshop_item.rs`
- [x] 1.2 Add `children: Option<Vec<Option<WorkshopItem>>>` field to `WorkshopItem` struct in `src/api/workshop_item.rs`
- [x] 1.3 Add `set_return_children` handling in `handle_query_config` function
- [x] 1.4 Implement child fetching logic in `WorkshopItem::from_query_results` to populate `children` field when `returnChildren` is enabled
- [x] 1.5 Update `WorkshopItemsResult::from_query_results` to handle children population
- [x] 1.6 Update `WorkshopPaginatedResult::from_query_results` to handle children population
- [x] 1.7 Run `cargo build` to verify Rust compilation

## 2. TypeScript Definitions

- [x] 2.1 Add `returnChildren?: boolean` to `WorkshopItemQueryConfig` interface in `client.d.ts`
- [x] 2.2 Add `children?: Array<WorkshopItem>` to `WorkshopItem` interface in `client.d.ts`

## 3. Testing

- [ ] 3.1 Create test case for query with `returnChildren = true` to verify children are populated
- [ ] 3.2 Create test case for query without `returnChildren` to verify backward compatibility
- [ ] 3.3 Create test case for collection items with nested children
- [ ] 3.4 Create test case for items with no children (verify empty array vs undefined)
- [ ] 3.5 Run TypeScript type checking to verify definitions are correct

## 4. Documentation

- [x] 4.1 Update JSDoc comments for `WorkshopItemQueryConfig` to document `returnChildren` option
- [x] 4.2 Update JSDoc comments for `WorkshopItem` to document `children` property
- [ ] 4.3 Add example usage in README or examples directory showing hierarchical workshop queries
