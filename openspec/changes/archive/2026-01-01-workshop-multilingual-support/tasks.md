## 1. Investigation and Research
- [x] 1.1 Research Steamworks SDK documentation for localization APIs (SetItemTitle, SetItemDescription with language parameters)
- [x] 1.2 Investigate steamworks-rs support for per-language Workshop content updates
- [x] 1.3 Confirm Steam API constraint: only one language can be updated per operation (not batch)
- [x] 1.4 Document Steam language codes and their mapping (e.g., "english", "schinese", "french")

## 2. Type Definitions
- [x] 2.1 Define `Language` union type with common Steam language codes in `client.d.ts`
- [x] 2.2 Extend `UgcUpdate` interface with optional `language` property
- [x] 2.3 Ensure backward compatibility - existing `title`/`description` properties remain optional
- [x] 2.4 Add JSDoc comments explaining that `language` parameter targets specific language for the update

## 3. Rust Implementation
- [x] 3.1 Update `UgcUpdate` struct in `src/api/workshop.rs` to include `language` field
- [x] 3.2 Implement language parameter mapping from JavaScript strings to Steam language types
- [x] 3.3 Modify `UgcUpdate::submit()` method to call Steam API with language parameter when specified
- [x] 3.4 Handle default behavior (no language specified) to maintain backward compatibility
- [x] 3.5 Test Rust build with `cargo build` or `npm run build`

## 4. TypeScript Binding Updates
- [x] 4.1 Regenerate TypeScript definitions via NAPI build process
- [x] 4.2 Verify new types are properly exported in `client.d.ts`
- [x] 4.3 Add JSDoc comments for new API surface with usage examples

## 5. Testing
- [x] 5.1 Create test case for update without language parameter (backward compatibility)
- [x] 5.2 Create test case for single-language update with `language: "english"`
- [x] 5.3 Create test case for multiple languages by calling `updateItem()` multiple times
- [ ] 5.4 Verify Workshop item displays correctly in different languages on Steam
- [ ] 5.5 Test error handling for invalid language codes

## 6. Documentation
- [x] 6.1 Update README.md with per-language update examples
- [x] 6.2 Add example showing multiple `updateItem()` calls for different languages
- [x] 6.3 Document supported language codes

## 7. Validation
- [x] 7.1 Run `npx openspec validate workshop-multilingual-support --strict`
- [x] 7.2 Fix any validation errors
- [x] 7.3 Ensure all tasks in this file are completed before requesting approval
