# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# Não publicado

### Corrigido
- Adicionado `throw error` na tratativa de erros na action `destroy` para conseguir recuperar o erro.

# 3.2.0 - 11-02-2022

### Adicionado
- Adicionado plugin `RxDBJsonDumpPlugin` para importar e exportar JSON do banco de dados.
- Adicionado à documentação a forma de utilizar o recurso.

# 3.1.0 - 03-02-2022

### Adicionado
- Novo callback na função `handleOnSync` para emitir os dados sincronizados.
- Nova função `runOnSync` para evitar duplicidade de código em `handleOnSync`. Ela fica responsável por chamar o hook `onSync`.

# 3.0.0 - 02-02-2022

### Adicionado
- Nova opção na classe VuexOffline `storage`, storage é um [adapter](https://rxdb.info/adapters.html), existem 2 opções por hora, `idb` (default) e `memory` (muito utilizado para testes, uma vez que não persiste os dados e é muito rápido).
- Nova [documentação](https://github.com/bildvitta/vuex-offline#readme).

### Modificado
- Atualizado "rxdb": "^11.3.0" -> "rxdb": "^10.5.4".
- Atualizado "rxjs": "^7.5.2" -> "rxjs": "^7.4.0".
- Documentação atualizada para português.

# 3.0.0-beta.4 - 27-01-2022

### Adicionado
- Custom build.

### Modificado
- Atualizado "rxdb": "^11.3.0" -> "rxdb": "^10.5.4".
- Atualizado "rxjs": "^7.5.2" -> "rxjs": "^7.4.0".

# 3.0.0-beta.3 - 27-01-2022

### Corrigido
- Removido custom build.

# 3.0.0-beta.2 - 26-01-2022

### Corrigido
- Adicionado "@babel/plugin-transform-runtime" para resolver erros de build.

# 3.0.0-beta.1 - 26-01-2022

### Corrigido
- Adicionado 'rxdb/plugins/replication-couchdb' e 'rxdb/plugins/pouchdb' em `external` no `rollup.config.js`.
- Atualizado package-lock.

# 3.0.0-beta.0 - 26-01-2022

### Adicionado
- Nova opção na classe VuexOffline `storage`, storage é um [adapter](https://rxdb.info/adapters.html) existem 2 opções por hora, `idb` (default) e `memory` (muito utilizado para testes, uma vez que não persiste os dados e é muito rápido).

### Modificado
- Atualizado "rxdb": "^9.20.0" -> "rxdb": "^11.3.0".
- Atualizado "rxjs": "^7.1.0" -> "rxjs": "^7.5.2".
- Documentação atualizada para português.

[comment]: <> (A partir da versão 3 toda documentação será feita em português.)

# 2.7.1 - 2021-10-27

### Changed
- Sending the percentage logic to vuex-offline.

# 2.7.0 - 2021-10-14

### Added
- added function `onSync` in constructor to get sync.

### Removed
- removed function `progress` in constructor.

# 2.6.0 - 2021-09-07

### Added
- added new function findByIds.

# 2.5.0 2021-08-24

### Added
- added new method `query` to sync.

# 2.4.1 2021-08-19

### Fixed
- added new method `deleteBy` for `setDefaults` work correctly.

# 2.4.0 2021-08-12

### Added
- added new option `interceptors` with `postSaveByAction` callback for intercepting all success execution of `create` and `update` action.

# 2.3.0 2021-07-29

### Added
- added option to send relationship in filters.
- added `preQueryList` function to intercept queries.
- added the possibility of having relationship of collections only for declared methods.

### Changed
- changed base url in `makesync` function.

### Fixed
- calculate progress only when pulling data in sync.

# 2.2.1 2021-07-16

### Added
- added `removeDatabase` method to `VuexOffline` class.

# 2.2.0 2021-07-16

### Added
- exported function `MakeSync` to synchronize database.
- send custom sync options through the module.
- send custom sync options through the vuex-offline constructor.
- added handler function in module to intercept synchronization.
- added function in constructor to get sync progress.
- added function in module to get the progress of collection synchronization.
- possibility to change model to filter in `getFindQuery` helper.

### Fixed
- filters with the same model was being overwritten.

## 2.1.0 2021-06-26

### Added
- exported `PouchDB` from `rxdb` to our plugin.
- exported `(find, findOne, database)` to our plugin.
- added new plugin `pouchdb-adapter-http` for sync.
- added vuex actions from module.

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
