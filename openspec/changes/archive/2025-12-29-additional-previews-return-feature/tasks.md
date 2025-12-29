## 1. Implementation

- [x] 1.1 Add `EItemPreviewType` enum to `src/api/workshop_item.rs` with all Steam preview type variants
- [x] 1.2 Create `AdditionalPreview` struct in `src/api/workshop_item.rs` with fields: `url_or_video_id`, `original_filename`, `preview_type`
- [x] 1.3 Add `additional_previews: Option<Vec<AdditionalPreview>>` field to `WorkshopItem` struct
- [x] 1.4 Implement `from_query_results` method extension to extract additional previews when enabled
- [x] 1.5 Update `WorkshopItem::from_query_results` to pass `return_additional_previews` flag through the call chain
- [x] 1.6 Add `get_additional_previews` helper method on `QueryResults` wrapper (may need to extend steamworks-rs)

## 2. TypeScript Definitions

- [x] 2.1 Add `ItemPreviewType` enum to `client.d.ts` with all preview type variants
- [x] 2.2 Add `AdditionalPreview` interface to `client.d.ts` with properties: `urlOrVideoId`, `originalFileName`, `type`
- [x] 2.3 Add `additionalPreviews?: Array<AdditionalPreview>` property to `WorkshopItem` interface

## 3. Testing

- [x] 3.1 Add JavaScript smoke test in `tests/` folder for `AdditionalPreview` type definitions
- [ ] 3.2 Create manual test script to verify additional previews are returned when `includeAdditionalPreviews: true`
- [ ] 3.3 Verify that queries without `includeAdditionalPreviews` set work correctly (backward compatibility)
- [ ] 3.4 Test with workshop items that have multiple previews (images, YouTube videos, etc.)

## 4. Documentation

- [x] 4.1 Update workshop queries spec with new requirements for additional previews
- [x] 4.2 Add JSDoc comments to TypeScript interfaces explaining preview types and usage
