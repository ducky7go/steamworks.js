# Change: Add steamworks-rs as Git Submodule

## Why
The current dependency on steamworks-rs uses a git URL with a pinned revision in Cargo.toml. This makes the source code of steamworks-rs opaque to AI code analysis tools and developers who need to understand the underlying implementation. By adding steamworks-rs as a git submodule, the source code becomes locally available for:

1. **AI-assisted code analysis** - AI systems can read and understand the full context including dependencies
2. **Easier debugging** - Developers can step through and inspect the steamworks-rs source code
3. **Better development experience** - IDE features like "go to definition" work across dependency boundaries
4. **Reproducible builds** - Submodule commit reference provides version pinning

## What Changes
- Add `https://github.com/Noxime/steamworks-rs` as a git submodule at `vendor/steamworks-rs`
- Update `Cargo.toml` to use the path dependency instead of git URL
- Update `.gitignore` to appropriately handle the vendor directory
- Add submodule initialization instructions to the README
- Update CI/CD configuration to handle submodule checkout and initialization

## Impact
- **Affected specs**: `steamworks-dependency` (MODIFIED)
- **Affected code**:
  - `Cargo.toml` - Change dependency from git to path
  - `.gitmodules` - New file for submodule configuration
  - `README.md` - Add submodule setup instructions
  - `.github/workflows/publish.yml` - Add submodule checkout action
- **Migration**: Existing users will need to run `git submodule update --init --recursive` after pulling the change
- **Risk**: Medium - changes dependency resolution mechanism but maintains same revision

## Alternatives Considered
1. **Keep git dependency** - Simple but doesn't provide source code access for AI analysis
2. **Copy source code directly** - Bloated repo, harder to update upstream
3. **Use cargo-vendor** - Downloads source but not tracked in git for AI analysis
4. **Submodule approach** - Clean separation, easy updates, tracked in git (CHOSEN)
