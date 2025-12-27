# Project Context

## Purpose
steamworks.js is a modern Steamworks SDK implementation for HTML/JS and Node.js applications. It serves as a replacement for the deprecated greenworks library, providing:

- Pre-built binaries (no need for users to build native modules)
- Full TypeScript type definitions
- Promise-based API design instead of callbacks
- Electron support with Steam Overlay integration
- Cross-platform support (Windows, Linux, macOS)

## Tech Stack
- **Languages**: Rust (native layer), JavaScript/TypeScript (API layer)
- **Build Tools**:
  - `@napi-rs/cli` - N-API Rust bindings
  - Cargo - Rust package manager
  - TypeScript compiler
- **Core Dependencies**:
  - `steamworks-rs` - Rust bindings to Steamworks SDK
  - `napi` - Node.js native addon framework
  - `tokio` - Async runtime
  - `serde/serde_json` - Serialization

## Project Conventions

### Code Style
- **JavaScript/TypeScript**:
  - Prettier configuration: single quotes, trailing commas, LF line endings
  - Print width: 140, tab width: 4
  - No semicolons, consistent quote props
- **Rust**:
  - Use `cargo fmt` for formatting
  - Use `cargo clippy` for linting

### Architecture Patterns
- **N-API based**: Rust implementation exposed to Node.js via N-API
- **Async/Promise-based**: Modern async API design instead of callback patterns
- **Module structure**: Each Steam API feature has its own module under `src/api/`
- **Type safety**: Full TypeScript definitions in `client.d.ts` and `index.d.ts`

### Testing Strategy
- Manual testing with real Steam API (test files in `test/` directory)
- Electron integration tests in `test/electron/`
- TypeScript type checking tests
- Tests cover: auth, callbacks, matchmaking, networking, workshop, overlay, etc.

### Git Workflow
- Main branch: `main`
- PR-based workflow for contributions
- Commit messages follow conventional format

## Domain Context

### Steam API Integration
This project provides JavaScript bindings to Valve's Steamworks API, covering:
- **Achievements** - Unlock and manage Steam achievements
- **Auth** - Steam authentication and ticket handling
- **Apps** - Application info and metrics
- **Callbacks** - Event-based Steam callbacks
- **Cloud** - Steam Cloud storage
- **Input** - Steam Input API
- **Matchmaking** - Lobby and matchmaking system
- **Networking** - P2P networking via Steam
- **Workshop** - Steam Workshop integration

### Key Concepts
- **Steam Client** - Must be running for Steam API to function
- **App ID** - Each Steam app has a unique identifier (steam_appid.txt)
- **Steam Overlay** - In-game overlay browser and UI
- **Callbacks** - Steam sends async callbacks for events

## Important Constraints

### Platform Support
- Windows (x64)
- Linux (x64)
- macOS (x64, ARM64)
- Node.js 14+ required

### Steam Requirements
- Steam must be running for most API calls
- Valid Steam app ID required (via `steam_appid.txt` or environment)
- Some features require the app to be downloaded/purchased via Steam

### Electron Specifics
- Steam Overlay requires special Electron configuration
- Context isolation considerations for preload scripts

## External Dependencies

### Steamworks SDK
- Proprietary SDK from Valve Corporation
- Access requires Steamworks agreement
- Version pinned via `steamworks-rs` dependency

### Steam Client
- Required to be running for API access
- Provides authentication and overlay functionality

### Platform-Specific
- Windows: MSVC build tools
- Linux: GCC/Clang
- macOS: Xcode command line tools
