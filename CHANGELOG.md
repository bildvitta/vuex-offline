# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.0 - 2021-04-13
### Added
- New prop option `refValue` in schema for choose key `value`

## 1.0.2 - 2021-04-09

### Fixed
- getFieldsWithRelationOptionsById -> fields[key].options = this.setOptions(await document.populate(key), key) [OLD]
- getFieldsWithRelationOptions -> fields[key].options = this.setOptions(await this.collections[key].find().exec(), key) [OLD]

## 1.0.1 - 2021-04-06
### Added
- `CHANGELOG.md`

### Changed
- Action `fetchSingle` inside `vuexOffline.js` to fix a bug.
