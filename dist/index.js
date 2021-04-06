(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('date-fns'), require('rxdb'), require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'date-fns', 'rxdb', 'lodash'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VuexOffline = {}, global.dateFns, global.rxdb, global.lodash));
}(this, (function (exports, dateFns, rxdb, lodash) { 'use strict';

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  /**
   * Class to abstract the PouchDB implementation.
   *
    * @param {options} DatabaseSetup options.
   */

  var _default = /*#__PURE__*/function () {
    function _default() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        databaseOptions: {}
      };

      _classCallCheck(this, _default);

      this.options = options;
      this.databaseOptions = options.databaseOptions;
      this.databaseName = this.databaseOptions.alias || this.databaseOptions.name;
      this.collectionsOptions = options.collections;
      this.database = null;
      this.collections = null;
      this.initialize();
    }

    _createClass(_default, [{
      key: "initialize",
      value: function initialize() {
        this.addPlugins([require('pouchdb-adapter-idb'), require('pouchdb-adapter-http')]);
      }
      /**
       * Add a plugin to rxdb.
       *
       * @param {addRxPlugin} plugin PouchDB plugin
       */

    }, {
      key: "addPlugin",
      value: function addPlugin(plugin) {
        rxdb.addRxPlugin(plugin);
      }
      /**
       * Add a list of plugins to PouchDB.
       *
       * @param {PouchDB[]} plugins List of PouchDB plugins
       */

    }, {
      key: "addPlugins",
      value: function addPlugins(plugins) {
        var _this = this;

        return plugins.forEach(function (plugin) {
          return _this.addPlugin(plugin);
        });
      }
    }, {
      key: "createDatabase",
      value: function () {
        var _createDatabase = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return rxdb.createRxDatabase(this.databaseOptions);

                case 3:
                  this.database = _context.sent;
                  return _context.abrupt("return", this.database);

                case 7:
                  _context.prev = 7;
                  _context.t0 = _context["catch"](0);
                  throw new Error('Error creating database.', _context.t0);

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this, [[0, 7]]);
        }));

        function createDatabase() {
          return _createDatabase.apply(this, arguments);
        }

        return createDatabase;
      }()
      /**
       * Get the database
       *
       * @param {string} name name of db.
       *
       * @example
       * databaseSetup.getDatabase('myDatabase')
       */

    }, {
      key: "getDatabase",
      value: function getDatabase(name) {
        return this.databases[name];
      }
      /**
       * Get the databases list
       */

    }, {
      key: "getDatabaseList",
      value: function getDatabaseList() {
        return this.databases;
      }
      /**
       * Delete the database. Note that this has no impact on other replicated databases.
       * Check: {@link https://rxdb.info/rx-database.html#destroy}
       *
       * @param {string} name name of database to be deleted
       *
       * @example
       * databaseSetup.deleteDatabase('myDatabase')
       */

    }, {
      key: "deleteDatabase",
      value: function () {
        var _deleteDatabase = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(name) {
          var database;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  database = this.getDatabase(name);

                  if (database) {
                    _context2.next = 3;
                    break;
                  }

                  throw new Error('Please provide a valid database to be deleted.');

                case 3:
                  _context2.prev = 3;
                  _context2.next = 6;
                  return database.destroy();

                case 6:
                  _context2.next = 11;
                  break;

                case 8:
                  _context2.prev = 8;
                  _context2.t0 = _context2["catch"](3);
                  throw new Error('Error deleting database.', _context2.t0);

                case 11:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[3, 8]]);
        }));

        function deleteDatabase(_x) {
          return _deleteDatabase.apply(this, arguments);
        }

        return deleteDatabase;
      }()
    }, {
      key: "createCollections",
      value: function () {
        var _createCollections = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(collections) {
          var collection;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.prev = 0;
                  _context3.next = 3;
                  return this.database.addCollections(collections || this.collectionsOptions);

                case 3:
                  collection = _context3.sent;
                  this.collections = this.database.collections;
                  return _context3.abrupt("return", collection);

                case 8:
                  _context3.prev = 8;
                  _context3.t0 = _context3["catch"](0);
                  throw new Error('Error creating collections.', _context3.t0);

                case 11:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[0, 8]]);
        }));

        function createCollections(_x2) {
          return _createCollections.apply(this, arguments);
        }

        return createCollections;
      }()
    }]);

    return _default;
  }();

  var _default$1 = /*#__PURE__*/function () {
    function _default(collection) {
      _classCallCheck(this, _default);

      this.collection = collection;
    }

    _createClass(_default, [{
      key: "getCount",
      value: function () {
        var _getCount = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(query) {
          var list;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return this.collection.find(query).exec();

                case 2:
                  list = _context.sent;
                  return _context.abrupt("return", list.length);

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function getCount(_x) {
          return _getCount.apply(this, arguments);
        }

        return getCount;
      }()
    }, {
      key: "getCustomFields",
      value: function getCustomFields() {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        var customFields = {};
        var fields = this.getAllFields();

        for (var key in fields) {
          if (fields[key].props) {
            customFields[key] = fields[key].props;
            callback(fields[key].props);
          }
        }

        return customFields;
      }
    }, {
      key: "getAllFields",
      value: function getAllFields() {
        return this.collection.schema.jsonSchema.properties;
      }
    }, {
      key: "getFiltersFields",
      value: function getFiltersFields() {
        var filtersFields = {};
        var customFields = this.getCustomFields();

        for (var key in customFields) {
          var filters = customFields[key].filter;
          if (!filters) continue;

          if (typeof filters === 'boolean') {
            filtersFields[key] = customFields[key].field;
            continue;
          }

          for (var filtersKey in filters) {
            filtersFields[filtersKey] = filters[filtersKey];
          }
        }

        return filtersFields;
      }
    }, {
      key: "getOnlyFields",
      value: function getOnlyFields() {
        var customFields = this.getCustomFields();
        var fields = {};

        for (var key in customFields) {
          if (customFields[key].field) {
            fields[key] = customFields[key].field;
          }
        }

        return fields;
      }
    }, {
      key: "getFiltersAndSearch",
      value: function getFiltersAndSearch() {
        var customFields = this.getFiltersFields();
        var object = {
          filters: [],
          search: []
        };

        for (var key in customFields) {
          object.filters.push(key);
          customFields[key].search && object.search.push(key);
        }

        return object;
      }
    }, {
      key: "getNestedFields",
      value: function getNestedFields() {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        var nestedFields = {};
        this.getCustomFields(function (custom) {
          var field = custom.field;

          if (field && field.type === 'nested') {
            nestedFields[field.name] = custom;
            callback(custom);
          }
        });
        return nestedFields;
      }
    }, {
      key: "getFieldsWithRelation",
      value: function getFieldsWithRelation() {
        var fields = {};
        var allFields = this.getAllFields();

        for (var key in allFields) {
          if (allFields[key].ref) {
            fields[key] = allFields[key];
          }
        }

        return fields;
      }
    }]);

    return _default;
  }();

  var _default$2 = /*#__PURE__*/function () {
    function _default() {
      _classCallCheck(this, _default);
    }

    _createClass(_default, [{
      key: "parseValue",
      value: function parseValue(value) {
        try {
          return JSON.parse(value);
        } catch (_unused) {
          return value;
        }
      }
    }, {
      key: "parseBoolean",
      value: function parseBoolean(value) {
        return ['true', 'false'].some(function (item) {
          return item === value;
        }) ? this.parseValue(value) : value;
      }
    }]);

    return _default;
  }();

  var _default$3 = /*#__PURE__*/function () {
    function _default(_ref) {
      var receivedFilters = _ref.receivedFilters,
          filtersList = _ref.filtersList,
          _ref$receivedSearch = _ref.receivedSearch,
          receivedSearch = _ref$receivedSearch === void 0 ? '' : _ref$receivedSearch,
          searchList = _ref.searchList,
          fieldsList = _ref.fieldsList;

      _classCallCheck(this, _default);

      this.fieldsList = fieldsList;
      this.filtersList = filtersList;
      this.receivedFilters = receivedFilters;
      this.receivedSearch = receivedSearch;
      this.searchList = searchList;
      this.parseHandler = new _default$2();
    }

    _createClass(_default, [{
      key: "getFilterFields",
      value: function getFilterFields() {
        var filters = {};

        var _iterator = _createForOfIteratorHelper(this.filtersList),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var filter = _step.value;

            if (!this.fieldsList[filter]) {
              throw new Error("Filter \"".concat(filter, "\" doesn't exists."));
            }

            filters[filter] = this.fieldsList[filter];
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return filters;
      }
    }, {
      key: "_setDefaultValueToQueryOperator",
      value: function _setDefaultValueToQueryOperator(queryOperator, value) {
        var defaultValues = {
          $all: [value],
          $eq: this.parseHandler.parseBoolean(value)
        };

        if (!(queryOperator in defaultValues)) {
          return value;
        }

        return defaultValues[queryOperator];
      }
    }, {
      key: "transformQuery",
      value: function transformQuery() {
        var transformedQuery = {};

        var _iterator2 = _createForOfIteratorHelper(this.filtersList),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var item = _step2.value;
            var filterField = this.fieldsList[item];
            transformedQuery[filterField.queryOrigin || item] = transformedQuery[filterField.queryOrigin || item] || {};

            if (this.receivedFilters[item]) {
              Object.assign(transformedQuery[filterField.queryOrigin || item], filterField.queryOperator ? _defineProperty({}, filterField.queryOperator, this._setDefaultValueToQueryOperator(filterField.queryOperator, this.receivedFilters[item])) : {
                $regex: ".*".concat(this.receivedFilters[item], ".*")
              });
              continue;
            }

            if (this.receivedSearch && filterField.search) {
              Object.assign(transformedQuery[filterField.queryOrigin || item], {
                $regex: ".*".concat(this.receivedSearch, ".")
              });
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        return {
          selector: _objectSpread2({}, transformedQuery)
        };
      }
    }]);

    return _default;
  }();

  var _default$4 = function _default() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        errors = _ref.errors;
        _ref.status;

    _classCallCheck(this, _default);

    return {
      response: {
        data: {
          errors: errors,
          status: {
            code: 400
          }
        }
      }
    };
  };

  var _default$5 = /*#__PURE__*/function () {
    function _default(collection, collections) {
      _classCallCheck(this, _default);

      this.collectionHandler = new _default$1(collection);
      this.fieldsWithRelation = this.collectionHandler.getFieldsWithRelation();
      this.collections = collections;
    }

    _createClass(_default, [{
      key: "setOptions",
      value: function setOptions() {
        var _this = this;

        var documents = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var key = arguments.length > 1 ? arguments[1] : undefined;
        var options = [];
        documents.forEach(function (document) {
          var parsedDocument = document.toJSON();
          options.push({
            value: document.uuid,
            label: document[_this.fieldsWithRelation[key].props['refLabel']],
            data: parsedDocument
          });
          return parsedDocument;
        });
        return options;
      }
    }, {
      key: "getFieldsWithRelationOptionsById",
      value: function () {
        var _getFieldsWithRelationOptionsById = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(document) {
          var fields, key;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  fields = lodash.cloneDeep(this.collectionHandler.getOnlyFields());
                  _context.t0 = regeneratorRuntime.keys(this.fieldsWithRelation);

                case 2:
                  if ((_context.t1 = _context.t0()).done) {
                    _context.next = 12;
                    break;
                  }

                  key = _context.t1.value;
                  _context.t2 = this;
                  _context.next = 7;
                  return document.populate(key);

                case 7:
                  _context.t3 = _context.sent;
                  _context.t4 = key;
                  fields[key].options = _context.t2.setOptions.call(_context.t2, _context.t3, _context.t4);
                  _context.next = 2;
                  break;

                case 12:
                  return _context.abrupt("return", fields);

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function getFieldsWithRelationOptionsById(_x) {
          return _getFieldsWithRelationOptionsById.apply(this, arguments);
        }

        return getFieldsWithRelationOptionsById;
      }()
    }, {
      key: "getFieldsWithRelationOptions",
      value: function () {
        var _getFieldsWithRelationOptions = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(externalFields) {
          var fields, key;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  fields = lodash.cloneDeep(externalFields || this.collectionHandler.getOnlyFields());
                  _context2.t0 = regeneratorRuntime.keys(this.fieldsWithRelation);

                case 2:
                  if ((_context2.t1 = _context2.t0()).done) {
                    _context2.next = 12;
                    break;
                  }

                  key = _context2.t1.value;
                  _context2.t2 = this;
                  _context2.next = 7;
                  return this.collections[key].find().exec();

                case 7:
                  _context2.t3 = _context2.sent;
                  _context2.t4 = key;
                  fields[key].options = _context2.t2.setOptions.call(_context2.t2, _context2.t3, _context2.t4);
                  _context2.next = 2;
                  break;

                case 12:
                  return _context2.abrupt("return", fields);

                case 13:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, this);
        }));

        function getFieldsWithRelationOptions(_x2) {
          return _getFieldsWithRelationOptions.apply(this, arguments);
        }

        return getFieldsWithRelationOptions;
      }()
    }]);

    return _default;
  }();

  var _default$6 = /*#__PURE__*/function () {
    function _default() {
      _classCallCheck(this, _default);
    }

    _createClass(_default, [{
      key: "create",
      value: function create(date) {
        date = date || new Date();
        var uuid = this.uuidv4();
        var comb = ('00000000000' + date.getTime().toString(16)).substr(-12);
        comb = comb.slice(0, 8) + '-' + comb.slice(8, 12);
        return uuid.replace(uuid.slice(0, 13), comb);
      }
    }, {
      key: "uuidv4",
      value: function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
          return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
        });
      }
    }]);

    return _default;
  }();

  var _default$7 = /*#__PURE__*/function () {
    function _default(rxError, collection) {
      _classCallCheck(this, _default);

      this.errors = rxError.parameters.errors;
      this.schema = rxError.parameters.schema;
      this.collectionHandler = new _default$1(collection);
      this.customFields = this.collectionHandler.getCustomFields();
      return new _default$4({
        errors: this.setErrors()
      });
    }

    _createClass(_default, [{
      key: "getErrorMessagesFromCustomFields",
      value: function getErrorMessagesFromCustomFields() {
        var errorMessages = {};

        for (var key in this.customFields) {
          if (this.customFields[key].errorMessage) {
            errorMessages[key] = this.customFields[key].errorMessage;
          }
        }

        return errorMessages;
      }
    }, {
      key: "setErrors",
      value: function setErrors() {
        var errors = {};
        var customErrors = this.getErrorMessagesFromCustomFields();

        var _iterator = _createForOfIteratorHelper(this.errors),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var error = _step.value;
            var field = error.field;
            var key = field.split('.')[1];
            errors[key] = customErrors[key];
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return errors;
      }
    }]);

    return _default;
  }();

  var _default$8 = /*#__PURE__*/function () {
    function _default() {
      _classCallCheck(this, _default);
    }

    _createClass(_default, [{
      key: "handler",
      value: function handler() {
        var nested = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var destroyKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'destroyed';

        if (!Array.isArray(nested)) {
          throw new Error('Array needed.');
        }

        var index = 0;
        var counter = 1;

        function hasNext() {
          return index < nested.length;
        }

        function next() {
          return nested[index++];
        }

        while (hasNext()) {
          var current = next();

          if (current.id && !current[destroyKey]) {
            counter = current.id;
          }

          if (current[destroyKey]) {
            index--;
            nested.splice(index, 1);
            continue;
          }

          current.id = counter;

          for (var key in current) {
            if (Array.isArray(current[key]) && current[key].length) {
              this.handler(nested[index - 1][key]);
            }
          }

          counter++;
        }

        return nested;
      }
    }]);

    return _default;
  }();

  var VuexOffline = /*#__PURE__*/function () {
    function VuexOffline(databaseSetup) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, VuexOffline);

      if (!(databaseSetup instanceof _default)) {
        throw new Error('Please, provide an instance of DatabaseSetup');
      }

      this.databaseSetup = databaseSetup;
      this.idAttribute = options.idAttribute;
    }

    _createClass(VuexOffline, [{
      key: "createStoreModule",
      value: function () {
        var _createStoreModule = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(collectionName) {
          var options,
              idAttribute,
              perPage,
              collection,
              collectionHandler,
              _collectionHandler$ge,
              filtersList,
              searchList,
              fieldsList,
              allFields,
              relationsHandler,
              fieldsWithRelationOptions,
              nested,
              save,
              module,
              _args9 = arguments;

          return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  options = _args9.length > 1 && _args9[1] !== undefined ? _args9[1] : {};

                  if (collectionName) {
                    _context9.next = 3;
                    break;
                  }

                  throw new Error('CollectionName name must be sended.');

                case 3:
                  idAttribute = options.idAttribute || this.idAttribute || 'uuid';
                  perPage = options.perPage || 12;
                  collection = this.databaseSetup.collections[collectionName];
                  collectionHandler = new _default$1(collection);
                  _collectionHandler$ge = collectionHandler.getFiltersAndSearch(), filtersList = _collectionHandler$ge.filters, searchList = _collectionHandler$ge.search;
                  fieldsList = collectionHandler.getFiltersFields();
                  collectionHandler.getFieldsWithRelation();
                  allFields = collectionHandler.getAllFields();
                  relationsHandler = new _default$5(collection, this.databaseSetup.collections);
                  _context9.next = 14;
                  return relationsHandler.getFieldsWithRelationOptions();

                case 14:
                  fieldsWithRelationOptions = _context9.sent;
                  nested = new _default$8();

                  save = /*#__PURE__*/function () {
                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
                      var commit,
                          _ref3,
                          payload,
                          id,
                          model,
                          document,
                          parsedDocument,
                          _args = arguments;

                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              commit = _ref.commit;
                              _ref3 = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, payload = _ref3.payload, id = _ref3.id, model = _ref3.model;
                              _context.prev = 2;
                              document = collection.findOne(id || payload.uuid);

                              if (!(!document || !id && !payload.uuid)) {
                                _context.next = 6;
                                break;
                              }

                              throw new _default$4({
                                status: {
                                  code: '404',
                                  text: 'Not found'
                                }
                              });

                            case 6:
                              if (allFields.updatedAt) {
                                payload.updatedAt = dateFns.formatISO(new Date());
                              }

                              collectionHandler.getNestedFields(function (nestedField) {
                                payload[nestedField.field.name] = nested.handler(payload[nestedField.field.name]);
                              });
                              _context.next = 10;
                              return document.update({
                                $set: _objectSpread2({}, payload)
                              });

                            case 10:
                              parsedDocument = _context.sent;
                              commit('setErrors', {
                                model: model
                              });
                              commit('replaceItem', parsedDocument.toJSON());
                              return _context.abrupt("return", {
                                data: {
                                  result: parsedDocument,
                                  status: {
                                    code: 200
                                  }
                                }
                              });

                            case 16:
                              _context.prev = 16;
                              _context.t0 = _context["catch"](2);
                              commit('setErrors', {
                                model: model,
                                hasError: true
                              });
                              throw new _default$7(_context.t0, collection);

                            case 20:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee, null, [[2, 16]]);
                    }));

                    return function save(_x2) {
                      return _ref2.apply(this, arguments);
                    };
                  }();

                  module = {
                    namespaced: true,
                    // states
                    state: {
                      filters: {},
                      list: [],
                      totalPages: 0,
                      errors: {
                        onCreate: false,
                        onFetchSingle: false,
                        onFetchList: false,
                        onReplace: false,
                        onFetchFilters: false
                      }
                    },
                    // getters
                    getters: {
                      list: function list(state) {
                        return state.list;
                      },
                      filters: function filters(state) {
                        return state.filters;
                      },
                      totalPages: function totalPages(state) {
                        return state.totalPages;
                      },
                      byId: function byId(state) {
                        return function (id) {
                          return state.list.find(function (item) {
                            return item[idAttribute] === id;
                          });
                        };
                      }
                    },
                    // mutations
                    mutations: {
                      setFilters: function setFilters(state, payload) {
                        state.filters = payload;
                      },
                      setList: function setList(state, payload) {
                        var _state$list;

                        var results = payload.results,
                            increment = payload.increment,
                            count = payload.count;
                        state.list = results || [];
                        increment ? (_state$list = state.list).push.apply(_state$list, _toConsumableArray(results)) : state.list = results || [];
                        state.totalPages = Math.ceil(count / perPage);
                      },
                      setItemList: function setItemList(state) {
                        var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                        state.list.push(payload);
                      },
                      setErrors: function setErrors(state, _ref4) {
                        var model = _ref4.model,
                            hasError = _ref4.hasError;
                        state[model] = !!hasError;
                      },
                      replaceItem: function replaceItem(state, payload) {
                        var index = state.list.findIndex(function (item) {
                          return item[idAttribute] === payload[idAttribute];
                        });
                        ~index ? state.list.splice(index, 1, payload) : state.list.push(payload);
                      },
                      removeItem: function removeItem(state, id) {
                        var index = state.list.findIndex(function (item) {
                          return item[idAttribute] === id;
                        });
                        ~index && state.list.splice(index, 1);
                      }
                    },
                    // actions
                    actions: {
                      create: function () {
                        var _create = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref5, _ref6) {
                          var commit, payload, uuid, documentToBeInserted, dateNow, document, parsedDocument;
                          return regeneratorRuntime.wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  commit = _ref5.commit;
                                  payload = _ref6.payload;
                                  _context2.prev = 2;
                                  uuid = new _default$6();
                                  documentToBeInserted = _objectSpread2({
                                    uuid: uuid.create()
                                  }, payload);
                                  dateNow = dateFns.formatISO(new Date());

                                  if (allFields.createdAt) {
                                    documentToBeInserted.createdAt = dateNow;
                                  }

                                  if (allFields.updatedAt) {
                                    documentToBeInserted.updatedAt = dateNow;
                                  }

                                  collectionHandler.getNestedFields(function (nestedField) {
                                    documentToBeInserted[nestedField.field.name] = nested.handler(documentToBeInserted[nestedField.field.name]);
                                  });
                                  _context2.next = 11;
                                  return collection.insert(documentToBeInserted);

                                case 11:
                                  document = _context2.sent;
                                  parsedDocument = document.toJSON();
                                  commit('setErrors', {
                                    model: 'onCreate'
                                  });
                                  commit('setItemList', parsedDocument);
                                  return _context2.abrupt("return", {
                                    data: {
                                      metadata: _objectSpread2({}, parsedDocument),
                                      status: {
                                        code: 200
                                      }
                                    }
                                  });

                                case 18:
                                  _context2.prev = 18;
                                  _context2.t0 = _context2["catch"](2);
                                  commit('setErrors', {
                                    model: 'onCreate',
                                    hasError: true
                                  });
                                  throw new _default$7(_context2.t0, collection);

                                case 22:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2, null, [[2, 18]]);
                        }));

                        function create(_x3, _x4) {
                          return _create.apply(this, arguments);
                        }

                        return create;
                      }(),
                      replace: function () {
                        var _replace = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref7) {
                          var commit,
                              _ref8,
                              payload,
                              id,
                              _args3 = arguments;

                          return regeneratorRuntime.wrap(function _callee3$(_context3) {
                            while (1) {
                              switch (_context3.prev = _context3.next) {
                                case 0:
                                  commit = _ref7.commit;
                                  _ref8 = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {}, payload = _ref8.payload, id = _ref8.id;
                                  return _context3.abrupt("return", save({
                                    commit: commit
                                  }, {
                                    payload: payload,
                                    id: id,
                                    model: 'onReplace'
                                  }));

                                case 3:
                                case "end":
                                  return _context3.stop();
                              }
                            }
                          }, _callee3);
                        }));

                        function replace(_x5) {
                          return _replace.apply(this, arguments);
                        }

                        return replace;
                      }(),
                      update: function () {
                        var _update = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(_ref9) {
                          var commit,
                              _ref10,
                              payload,
                              id,
                              _args4 = arguments;

                          return regeneratorRuntime.wrap(function _callee4$(_context4) {
                            while (1) {
                              switch (_context4.prev = _context4.next) {
                                case 0:
                                  commit = _ref9.commit;
                                  _ref10 = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {}, payload = _ref10.payload, id = _ref10.id;
                                  return _context4.abrupt("return", save({
                                    commit: commit
                                  }, {
                                    payload: payload,
                                    id: id,
                                    model: 'onUpdate'
                                  }));

                                case 3:
                                case "end":
                                  return _context4.stop();
                              }
                            }
                          }, _callee4);
                        }));

                        function update(_x6) {
                          return _update.apply(this, arguments);
                        }

                        return update;
                      }(),
                      fetchSingle: function () {
                        var _fetchSingle = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(_ref11) {
                          var commit,
                              _ref12,
                              form,
                              id,
                              document,
                              parsedDocument,
                              fields,
                              _args5 = arguments;

                          return regeneratorRuntime.wrap(function _callee5$(_context5) {
                            while (1) {
                              switch (_context5.prev = _context5.next) {
                                case 0:
                                  commit = _ref11.commit;
                                  _ref12 = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {}, form = _ref12.form, id = _ref12.id, _ref12.params, _ref12.url;

                                  if (!(!id && form)) {
                                    _context5.next = 4;
                                    break;
                                  }

                                  return _context5.abrupt("return", {
                                    data: {
                                      status: {
                                        code: 200
                                      },
                                      fields: fieldsWithRelationOptions
                                    }
                                  });

                                case 4:
                                  _context5.prev = 4;
                                  _context5.next = 7;
                                  return collection.findOne(id).exec();

                                case 7:
                                  document = _context5.sent;

                                  if (document) {
                                    _context5.next = 10;
                                    break;
                                  }

                                  throw new _default$4({
                                    status: {
                                      code: '404',
                                      text: 'Not found'
                                    }
                                  });

                                case 10:
                                  parsedDocument = document.toJSON();

                                  if (!form) {
                                    _context5.next = 15;
                                    break;
                                  }

                                  _context5.t0 = fieldsWithRelationOptions;
                                  _context5.next = 18;
                                  break;

                                case 15:
                                  _context5.next = 17;
                                  return relationsHandler.getFieldsWithRelationOptionsById(parsedDocument);

                                case 17:
                                  _context5.t0 = _context5.sent;

                                case 18:
                                  fields = _context5.t0;
                                  commit('replaceItem', parsedDocument);
                                  commit('setErrors', {
                                    model: 'onFetchSingle'
                                  });
                                  return _context5.abrupt("return", {
                                    data: {
                                      fields: fields,
                                      result: parsedDocument,
                                      status: {
                                        code: 200
                                      }
                                    }
                                  });

                                case 24:
                                  _context5.prev = 24;
                                  _context5.t1 = _context5["catch"](4);
                                  commit('setErrors', {
                                    model: 'onFetchSingle',
                                    hasError: true
                                  });
                                  throw _context5.t1;

                                case 28:
                                case "end":
                                  return _context5.stop();
                              }
                            }
                          }, _callee5, null, [[4, 24]]);
                        }));

                        function fetchSingle(_x7) {
                          return _fetchSingle.apply(this, arguments);
                        }

                        return fetchSingle;
                      }(),
                      fetchFilters: function () {
                        var _fetchFilters = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(_ref13) {
                          var commit, filtersHandler, filterFields, formattedFilterFields;
                          return regeneratorRuntime.wrap(function _callee6$(_context6) {
                            while (1) {
                              switch (_context6.prev = _context6.next) {
                                case 0:
                                  commit = _ref13.commit;
                                  filtersHandler = new _default$3({
                                    filtersList: filtersList,
                                    fieldsList: fieldsList
                                  });
                                  filterFields = filtersHandler.getFilterFields();
                                  _context6.next = 5;
                                  return relationsHandler.getFieldsWithRelationOptions(filterFields);

                                case 5:
                                  formattedFilterFields = _context6.sent;
                                  commit('setFilters', formattedFilterFields);
                                  return _context6.abrupt("return", {
                                    fields: formattedFilterFields,
                                    status: {
                                      code: 200
                                    }
                                  });

                                case 8:
                                case "end":
                                  return _context6.stop();
                              }
                            }
                          }, _callee6);
                        }));

                        function fetchFilters(_x8) {
                          return _fetchFilters.apply(this, arguments);
                        }

                        return fetchFilters;
                      }(),
                      fetchList: function () {
                        var _fetchList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(_ref14) {
                          var commit,
                              _ref15,
                              _ref15$filters,
                              filters,
                              increment,
                              _ref15$page,
                              page,
                              limit,
                              search,
                              filtersHandler,
                              skip,
                              query,
                              count,
                              documents,
                              parsedDocuments,
                              _args7 = arguments;

                          return regeneratorRuntime.wrap(function _callee7$(_context7) {
                            while (1) {
                              switch (_context7.prev = _context7.next) {
                                case 0:
                                  commit = _ref14.commit;
                                  _ref15 = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {}, _ref15$filters = _ref15.filters, filters = _ref15$filters === void 0 ? {} : _ref15$filters, increment = _ref15.increment, _ref15.ordering, _ref15$page = _ref15.page, page = _ref15$page === void 0 ? 1 : _ref15$page, limit = _ref15.limit, search = _ref15.search;
                                  _context7.prev = 2;
                                  filtersHandler = new _default$3({
                                    receivedFilters: filters,
                                    filtersList: filtersList,
                                    receivedSearch: search,
                                    searchList: searchList,
                                    fieldsList: fieldsList
                                  });
                                  skip = (page - 1) * (limit || perPage);
                                  query = filtersHandler.transformQuery();
                                  _context7.next = 8;
                                  return collectionHandler.getCount(query);

                                case 8:
                                  count = _context7.sent;
                                  _context7.next = 11;
                                  return collection.find(query).limit(limit || perPage).skip(skip).exec();

                                case 11:
                                  documents = _context7.sent;
                                  parsedDocuments = documents.map(function (document) {
                                    return document.toJSON();
                                  });
                                  commit('setList', {
                                    results: parsedDocuments,
                                    increment: increment,
                                    count: count
                                  });
                                  commit('setErrors', {
                                    model: 'onFetchList'
                                  });
                                  return _context7.abrupt("return", {
                                    data: {
                                      results: parsedDocuments,
                                      fields: fieldsWithRelationOptions,
                                      status: {
                                        code: 200
                                      }
                                    }
                                  });

                                case 18:
                                  _context7.prev = 18;
                                  _context7.t0 = _context7["catch"](2);
                                  commit('setErrors', {
                                    model: 'onFetchList',
                                    hasError: true
                                  });
                                  throw _context7.t0;

                                case 22:
                                case "end":
                                  return _context7.stop();
                              }
                            }
                          }, _callee7, null, [[2, 18]]);
                        }));

                        function fetchList(_x9) {
                          return _fetchList.apply(this, arguments);
                        }

                        return fetchList;
                      }(),
                      destroy: function () {
                        var _destroy = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(_ref16) {
                          var commit,
                              _ref17,
                              id,
                              document,
                              _args8 = arguments;

                          return regeneratorRuntime.wrap(function _callee8$(_context8) {
                            while (1) {
                              switch (_context8.prev = _context8.next) {
                                case 0:
                                  commit = _ref16.commit;
                                  _ref17 = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {}, id = _ref17.id;
                                  _context8.prev = 2;
                                  _context8.next = 5;
                                  return collection.findOne(id).exec();

                                case 5:
                                  document = _context8.sent;

                                  if (document) {
                                    _context8.next = 8;
                                    break;
                                  }

                                  throw new _default$4({
                                    status: {
                                      code: 404,
                                      text: 'Not found'
                                    }
                                  });

                                case 8:
                                  document.remove();
                                  commit('removeItem', id);
                                  commit('setErrors', {
                                    model: 'onDestroy'
                                  });
                                  return _context8.abrupt("return", {
                                    status: {
                                      code: 200
                                    }
                                  });

                                case 14:
                                  _context8.prev = 14;
                                  _context8.t0 = _context8["catch"](2);
                                  commit('setErrors', {
                                    model: 'onDestroy',
                                    hasError: true
                                  });
                                  throw _context8.t0;

                                case 18:
                                case "end":
                                  return _context8.stop();
                              }
                            }
                          }, _callee8, null, [[2, 14]]);
                        }));

                        function destroy(_x10) {
                          return _destroy.apply(this, arguments);
                        }

                        return destroy;
                      }()
                    }
                  };
                  Object.assign(module.actions, options.actions);
                  Object.assign(module.mutations, options.mutations);
                  return _context9.abrupt("return", module);

                case 21:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, this);
        }));

        function createStoreModule(_x) {
          return _createStoreModule.apply(this, arguments);
        }

        return createStoreModule;
      }()
    }]);

    return VuexOffline;
  }();

  exports.CollectionHandler = _default$1;
  exports.DatabaseSetup = _default;
  exports.Nested = _default$8;
  exports.default = VuexOffline;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
