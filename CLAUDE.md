<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Release Process

This project uses automated version management for npm releases.

## Creating an Official Release

To create an official release:

```bash
git tag v0.5.0
git push origin v0.5.0
```

When you push a `v*` tag:
- The CI/CD pipeline will extract the version from the tag (stripping the `v` prefix)
- The package will be built and published to npm with that version
- The package will be published to the npm `latest` dist-tag

Users can then install with: `npm i @ducky7go/steamworks.js`

## Development Releases

When you push to the `main` branch without a tag:
- The CI/CD pipeline automatically generates a development version
- Version format: `{base_version}-dev.{commit_count}` (e.g., `0.4.0-dev.150`)
- The package is published to the npm `dev` dist-tag

Users can install the latest development build with: `npm i @ducky7go/steamworks.js@dev`

## Version Detection

The workflow determines versions as follows:

1. **Tag push** (e.g., `v1.2.3`): Uses `1.2.3` as the version
2. **Main branch push**: Queries GitHub API for the latest release, then generates `{latest}-dev.{commit_count}`
