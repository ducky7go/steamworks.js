## 1. Configuration Updates

- [x] 1.1 Update `package.json` name field to `@ducky7go/steamworks.js`
- [x] 1.2 Verify `package.json` napi.name remains as `steamworksjs`
- [x] 1.3 Update `.github/workflows/publish.yml` repository deployment condition (if needed for new repo)
- [ ] 1.4 Verify `NPM_TOKEN` GitHub secret has publish permissions for `@ducky7go` scope

## 2. Documentation Updates

- [x] 2.1 Update README.md installation command to `npm i @ducky7go/steamworks.js`
- [x] 2.2 Update README.md npm badge URL to `https://npmjs.com/package/@ducky7go/steamworks.js`
- [x] 2.3 Update README.md code examples to show scoped package name
- [x] 2.4 Search and replace any remaining `steamworks.js` package references in documentation

## 3. Validation

- [ ] 3.1 Create a pull request with all changes
- [ ] 3.2 Verify build job completes successfully
- [ ] 3.3 Verify deploy job conditions are correct (should only run on main branch)
- [ ] 3.4 After merge, verify package is published to `@ducky7go/steamworks.js` on npm
- [ ] 3.5 Test package installation: `npm i @ducky7go/steamworks.js`
- [ ] 3.6 Verify native module loads correctly in test environment

## 4. Migration Documentation

- [x] 4.1 Add migration guide section to README.md
- [x] 4.2 Document breaking change for existing users
- [ ] 4.3 Consider adding deprecation notice to old package (if maintaining separate package)
