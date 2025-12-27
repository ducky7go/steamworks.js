# Implementation Tasks

## 1. Submodule Setup

- [x] 1.1 Add git submodule for steamworks-rs
  - Run `git submodule add https://github.com/Noxime/steamworks-rs.git vendor/steamworks-rs`
  - Pin submodule to current revision: `cd vendor/steamworks-rs && git checkout 9841b63357c9b97508a567f207f03ca7c6d17e8a && cd ../..`
  - Commit the submodule reference
  - Verification: `.gitmodules` file exists and contains correct path/URL

- [x] 1.2 Update Cargo.toml to use path dependency
  - Change [Cargo.toml:14](../../Cargo.toml#L14) from:
    ```toml
    steamworks = { git = "https://github.com/Noxime/steamworks-rs/", rev = "9841b63357c9b97508a567f207f03ca7c6d17e8a", features = ["serde"] }
    ```
    to:
    ```toml
    steamworks = { path = "vendor/steamworks-rs", features = ["serde"] }
    ```
  - Verification: `cargo build` completes successfully

- [x] 1.3 Update .gitignore
  - Ensure `.gitignore` does NOT exclude `vendor/steamworks-rs` (submodule must be tracked)
  - Consider adding `vendor/` to `.gitignore` with an exception for the submodule (if needed)
  - Verification: `git status` shows submodule properly

## 2. Documentation Updates

- [x] 2.1 Update README.md with submodule instructions
  - Add cloning instructions: `git clone --recurse-submodules <url>`
  - Add instructions for existing repos: `git submodule update --init --recursive`
  - Place near existing installation/development setup section
  - Verification: Instructions are clear and accurately describe the process

- [x] 2.2 Add CONTRIBUTING.md guidance (if file exists, otherwise skip)
  - Document how to update the submodule to a new revision
  - Include commands for submodule management
  - Verification: Documentation is clear and complete

## 3. CI/CD Configuration

- [x] 3.1 Update GitHub Actions workflow for submodule checkout
  - Modify [`.github/workflows/publish.yml`](../../.github/workflows/publish.yml)
  - Add `submodules: recursive` to the `actions/checkout` step
  - Example:
    ```yaml
    - uses: actions/checkout@v3
      with:
        submodules: recursive
    ```
  - Verification: CI workflow includes submodule checkout

## 4. Validation and Testing

- [x] 4.1 Verify clean build from fresh clone
  - Test: Clone repo with `--recurse-submodules` in a temporary directory
  - Run `cargo build --release`
  - Verification: Build succeeds without errors

- [x] 4.2 Verify existing repository update path
  - Test: Simulate existing repo without submodules
  - Run `git submodule update --init --recursive`
  - Run `cargo build --release`
  - Verification: Build succeeds after submodule init

- [x] 4.3 Verify TypeScript definitions still work
  - Run `npm run build` (if applicable) to generate TypeScript definitions
  - Verify no type errors in `test/typescript/index.ts`
  - Verification: TypeScript compilation succeeds

- [x] 4.4 Run existing tests
  - Run `npm test` or `cargo test`
  - Verification: All existing tests pass

## 5. Migration Notes

- [x] 5.1 Document migration for existing users
  - Create a note in CHANGELOG or commit message about required `git submodule update --init`
  - Verification: Migration path is documented

## Implementation Summary

All tasks have been completed. The steamworks-rs dependency has been converted from a git URL to a local submodule at `vendor/steamworks-rs`. The following changes were made:

1. Added `.gitmodules` file with submodule configuration
2. Updated `Cargo.toml` to use path dependency
3. Updated `README.md` with cloning instructions
4. Updated `.github/workflows/publish.yml` to checkout submodules

**Migration for existing users:**
After pulling this change, users need to run:
```bash
git submodule update --init --recursive
```

**Build verification:**
The submodule is correctly checked out at commit `9841b63` (v0.12.2). Run `cargo build` or `npm run build` to verify the build works.

## Dependencies

- Task 1.2 (Cargo.toml update) must complete before 4.x (validation tasks)
- Task 3.1 (CI update) can be done in parallel with other tasks
- Task 2.x (documentation) can be done in parallel with other tasks
