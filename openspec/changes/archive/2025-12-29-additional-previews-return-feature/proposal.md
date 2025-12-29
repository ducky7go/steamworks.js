# Change: Support SetReturnAdditionalPreviews

## Why

The current workshop query implementation already has the `SetReturnAdditionalPreviews` binding configured, but the additional previews data is not being exposed to users. Workshop items only return a single `previewUrl`, missing the opportunity to provide users with multiple preview images, videos, and other media types that are available through the Steam API.

## What Changes

- Expose additional previews data in `WorkshopItem` return type
- Add TypeScript interface for `AdditionalPreview` with `url`, `originalFileName`, and `type` properties
- Update Rust `WorkshopItem` struct to include `additional_previews: Option<Vec<AdditionalPreview>>`
- Implement extraction of additional previews from Steam API query results
- Add support for all Steam preview types (Image, YouTubeVideo, Sketchfab, EnvironmentMap variants, Clip, and custom types)
- Enable `raw-bindings` feature on steamworks-rs to access `sys::EItemPreviewType` through the public API instead of directly depending on steamworks-sys

## Impact

- Affected specs: `workshop-queries`
- Affected code:
  - `src/api/workshop_item.rs` - Rust struct and query result processing
  - `client.d.ts` - TypeScript type definitions
  - `vendor/steamworks-rs/src/ugc.rs` - Extended steamworks-rs with `num_additional_previews` and `get_additional_preview` methods
  - `Cargo.toml` - Added `raw-bindings` feature to steamworks dependency

## Status

ExecutionCompleted
