# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.1.0 2021-06-26

### Added
- exported `PouchDB` from `rxdb` to our plugin.
- exported `(find, findOne, database)` to our plugin.
- added new plugin `pouchdb-adapter-http` for sync.

### Changed
- changed search regex query.

## 2.0.4 2021-05-31
### Fixed
- Fix RxJS warn

## 2.0.0 2021-05-31
### Changed
- All data modeling

### Removed
- All middlewares
- Seeder

## 1.5.0 2021-05-04
### Added
- Added middlewares to method `createStoreModule` inside `VuexOffline`
  - beforeSave
  - beforeCreate

## 1.4.0 2021-04-28
### Added
- new pro `manyToMany` for relations.
- new way of relations many-to-many
- Added middlewares to method `createStoreModule` inside `VuexOffline`
  - fetchListQuery;
  - fetchListSuccess;
  - fetchListError;
  - fetchFiltersSuccess;
  - fetchFiltersError;
  - fetchSingleSuccess;
  - fetchSingleFormSuccess;
  - fetchSingleError;
  - saveSuccess;
  - saveError;
  - createSuccess;
  - createError.

## 1.2.1 - 2021-04-16
### Added
- files to `dist`

## 1.2.0 - 2021-04-16
### Added
- New class `Seeder`

### Changed
- Some changes for best performace in `VuexOffline`

### Fixed
- Fixed bug in getFieldsWithRelationOptionsById

## 1.1.1 - 2021-04-13
### Added
- files to `dist`

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
