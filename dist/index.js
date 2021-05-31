import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { RxDBReplicationPlugin } from 'rxdb/plugins/replication';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxError } from 'rxdb/dist/es/rx-error.js';

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
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
      it = it.call(o);
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

function formatResponse (response) {
  return {
    data: _objectSpread2({
      status: {
        code: 200
      }
    }, response)
  };
}

var ptBR = {
  'is required': 'Este campo é obrigatório.',
  // 'is the wrong type': '',
  // 'has additional items': '',
  'must be FORMAT format': 'Este campo precisa ser FORMAT.',
  'must be unique': 'Já existe um registro com este valor.',
  // 'must be an enum value': '',
  // 'dependencies not set': '',
  // 'has additional properties': '',
  // 'referenced schema does not match': '',
  // 'negative schema matches': '',
  // 'pattern mismatch': '',
  // 'no schemas match': '',
  // 'no (or more than one) schemas match': '',
  // 'has a remainder': '',
  'has more properties than allowed': 'Selecione menos propriedades.',
  'has less properties than allowed': 'Selecione mais propriedades.',
  'has more items than allowed': 'Selecione menos itens.',
  'has less items than allowed': 'Selecione mais itens.',
  'has longer length than allowed': 'O valor é muito grande.',
  'has less length than allowed': 'O valor é muito pequeno.',
  'is less than minimum': 'O valor é menor que o mínimo.',
  'is more than maximum': 'O valor é maior que o máximo.'
};

var localize = function localize(message) {
  return [ptBR[message] || message];
};

var labelize = function labelize(label) {
  return label.replace('data.', '');
};

function formatError (error) {
  var response = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!(error instanceof RxError)) {
    throw error;
  }

  var _error$parameters = error.parameters,
      databaseErrors = _error$parameters.errors,
      result = _error$parameters.obj;
  var errors = {};

  var _iterator = _createForOfIteratorHelper(databaseErrors),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _step.value,
          field = _step$value.field,
          message = _step$value.message;
      errors[labelize(field)] = localize(message);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return {
    response: formatResponse(_objectSpread2({
      status: {
        code: 400
      },
      errors: errors,
      result: result
    }, response))
  };
}

function getFieldsByType () {
  var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var type = arguments.length > 1 ? arguments[1] : undefined;
  var callback = arguments.length > 2 ? arguments[2] : undefined;
  var filteredFields = {};

  for (var key in fields) {
    var field = fields[key];

    if (field.type === type) {
      filteredFields[key] = field;
      callback === 'function' && callback(field);
    }
  }

  return filteredFields;
}

function setOptions (documents, _ref) {
  var label = _ref.label,
      value = _ref.value;
  return documents.map(function (document) {
    return {
      label: document[label],
      value: document[value],
      data: document.toJSON()
    };
  });
}

function getFieldsWithRelationshipOptions (_x) {
  return _ref2.apply(this, arguments);
}

function _ref2() {
  _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
    var fields, idKey, parent, relationships, key, relationship, ref, documents, relKey, relRef, _documents;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            fields = _ref.fields, idKey = _ref.idKey, parent = _ref.parent, relationships = _ref.relationships;
            fields = JSON.parse(JSON.stringify(fields));
            _context.t0 = regeneratorRuntime.keys(relationships);

          case 3:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 27;
              break;
            }

            key = _context.t1.value;
            relationship = relationships[key];
            ref = relationship.ref;

            if (!ref) {
              _context.next = 15;
              break;
            }

            if (!relationship.label) {
              relationship.label = idKey;
            }

            if (!relationship.value) {
              relationship.value = idKey;
            }

            _context.next = 12;
            return parent.collections[ref].find().exec();

          case 12:
            documents = _context.sent;
            fields[key].options = setOptions(documents, relationship);
            return _context.abrupt("continue", 3);

          case 15:
            _context.t2 = regeneratorRuntime.keys(relationship);

          case 16:
            if ((_context.t3 = _context.t2()).done) {
              _context.next = 25;
              break;
            }

            relKey = _context.t3.value;
            relRef = relationship[relKey].ref;
            _context.next = 21;
            return parent.collections[relRef].find().exec();

          case 21:
            _documents = _context.sent;
            fields[key].children[relKey] = _objectSpread2({
              options: setOptions(_documents, relationship[relKey])
            }, fields[key].children[relKey]);
            _context.next = 16;
            break;

          case 25:
            _context.next = 3;
            break;

          case 27:
            return _context.abrupt("return", fields);

          case 28:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ref2.apply(this, arguments);
}

function parseJSON (value) {
  try {
    return JSON.parse(value);
  } catch (_unused) {
    return value;
  }
}

function getFindQuery () {
  var moduleFilters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      filters = _ref.filters,
      search = _ref.search;

  var queryOperators = moduleFilters.queryOperators,
      searchFilter = moduleFilters.search;
  var filtersQuery = {};

  for (var name in filters) {
    var filter = filters[name];
    var queryOperator = queryOperators[name];

    if (!queryOperator) {
      throw new Error("The queryOperator is missing for filter \"".concat(name, "\"."));
    }

    if (typeof queryOperator === 'function') {
      var _ref2 = queryOperator(filter) || {},
          value = _ref2.value,
          operator = _ref2.operator;

      filtersQuery[name] = _defineProperty({}, operator || '$regex', parseJSON(value));
      continue;
    }

    filtersQuery[name] = _defineProperty({}, queryOperator, parseJSON(filter));
  }

  if (search) {
    filtersQuery.$or = (searchFilter || []).map(function (item) {
      return _defineProperty({}, item, {
        $regex: new RegExp("^".concat(search, "$"), 'i')
      });
    });
  }

  return {
    selector: _objectSpread2({}, filtersQuery)
  };
}

function mapJSON () {
  var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return array.map(function (item) {
    return item.toJSON();
  });
}

function nestField() {
  var nested = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var destroyedKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'destroyed';

  if (!Array.isArray(nested)) {
    throw new Error('Please provide a valid array.');
  }

  var index = 0;

  function hasNext() {
    return index < nested.length;
  }

  function next() {
    return nested[index++];
  }

  while (hasNext()) {
    var current = next();

    if (current[destroyedKey]) {
      index--;
      nested.splice(index, 1);
      continue;
    }

    for (var key in current) {
      if (Array.isArray(current[key]) && current[key].length) {
        nestField(nested[index - 1][key]);
      }
    }
  }

  return nested;
}

function setDefaults () {
  var defaults = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var response = {};

  for (var key in defaults) {
    var value = defaults[key];
    response[key] = typeof value === 'function' ? value() : value;
  }

  return response;
}

function statusResponse (code, text) {
  return {
    data: {
      status: {
        code: code,
        text: text
      }
    }
  };
}

function create (_ref, collection) {
  var defaults = _ref.defaults,
      fields = _ref.fields;
  return /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2, _ref3) {
      var commit, payload, document, documentJSON;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref2.commit;
              payload = _ref3.payload;
              payload = _objectSpread2(_objectSpread2({}, setDefaults(defaults)), payload);
              _context.prev = 3;
              getFieldsByType(fields, 'nested', function (_ref5) {
                var name = _ref5.name;
                payload[name] = nestField(payload[name]);
              });
              _context.next = 7;
              return collection.insert(payload);

            case 7:
              document = _context.sent;
              documentJSON = document.toJSON();
              commit('setListItem', documentJSON);
              return _context.abrupt("return", formatResponse({
                result: documentJSON
              }));

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](3);
              throw formatError(_context.t0);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 13]]);
    }));

    return function (_x, _x2) {
      return _ref4.apply(this, arguments);
    };
  }();
}

function destroy (module, collection) {
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, _ref2) {
      var commit, id, document, documentJSON;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref.commit;
              id = _ref2.id;
              _context.prev = 2;
              _context.next = 5;
              return collection.findOne(id).exec();

            case 5:
              document = _context.sent;

              if (document) {
                _context.next = 8;
                break;
              }

              throw statusResponse(404, 'Not found');

            case 8:
              documentJSON = document.toJSON();
              _context.next = 11;
              return document.remove();

            case 11:
              commit('removeListItem', id);
              return _context.abrupt("return", formatResponse({
                result: documentJSON
              }));

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](2);
              return _context.abrupt("return", _context.t0);

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[2, 15]]);
    }));

    return function (_x, _x2) {
      return _ref3.apply(this, arguments);
    };
  }();
}

function fetchFilters (_ref) {
  var filters = _ref.filters;
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
      var commit, fields;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref2.commit;
              _context.prev = 1;
              fields = filters.fields;
              commit('setFilters', fields);
              return _context.abrupt("return", formatResponse({
                fields: fields
              }));

            case 7:
              _context.prev = 7;
              _context.t0 = _context["catch"](1);
              return _context.abrupt("return", _context.t0);

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 7]]);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();
}

function fetchList (module, collection) {
  return /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref) {
      var commit,
          _ref3,
          filters,
          findQuery,
          increment,
          limit,
          _ref3$page,
          page,
          search,
          query,
          documents,
          count,
          skip,
          slicedDocuments,
          documentsJSON,
          _args = arguments;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref.commit;
              _ref3 = _args.length > 1 && _args[1] !== undefined ? _args[1] : {}, filters = _ref3.filters, findQuery = _ref3.findQuery, increment = _ref3.increment, limit = _ref3.limit, _ref3$page = _ref3.page, page = _ref3$page === void 0 ? 1 : _ref3$page, search = _ref3.search;

              if (!findQuery) {
                findQuery = getFindQuery(module.filters, {
                  filters: filters,
                  search: search
                });
              }

              _context.prev = 3;
              query = collection.find(findQuery).sort(module.sort);
              _context.next = 7;
              return query.exec();

            case 7:
              documents = _context.sent;
              count = documents.length;
              skip = (page - 1) * (limit || module.perPage);
              slicedDocuments = documents.slice(skip, skip + module.perPage);
              documentsJSON = mapJSON(slicedDocuments);
              commit('setList', {
                count: count,
                increment: increment,
                results: documentsJSON
              });
              _context.t0 = formatResponse;
              _context.next = 16;
              return getFieldsWithRelationshipOptions(module);

            case 16:
              _context.t1 = _context.sent;
              _context.t2 = documentsJSON;
              _context.t3 = {
                fields: _context.t1,
                results: _context.t2
              };
              return _context.abrupt("return", (0, _context.t0)(_context.t3));

            case 22:
              _context.prev = 22;
              _context.t4 = _context["catch"](3);
              return _context.abrupt("return", _context.t4);

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 22]]);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();
}

function fetchSingle (module, collection) {
  return /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref, _ref2) {
      var commit, form, id, fields, document, documentJSON;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref.commit;
              form = _ref2.form, id = _ref2.id;
              _context.next = 4;
              return getFieldsWithRelationshipOptions(module);

            case 4:
              fields = _context.sent;

              if (!(form && !id)) {
                _context.next = 7;
                break;
              }

              return _context.abrupt("return", formatResponse({
                fields: fields
              }));

            case 7:
              _context.prev = 7;
              _context.next = 10;
              return collection.findOne(id).exec();

            case 10:
              document = _context.sent;

              if (document) {
                _context.next = 13;
                break;
              }

              throw statusResponse(404, 'Not found');

            case 13:
              documentJSON = document.toJSON();
              commit('replaceItem', documentJSON);
              return _context.abrupt("return", formatResponse({
                fields: fields,
                result: documentJSON
              }));

            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](7);
              return _context.abrupt("return", _context.t0);

            case 21:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[7, 18]]);
    }));

    return function (_x, _x2) {
      return _ref3.apply(this, arguments);
    };
  }();
}

function update (_ref, collection) {
  var fields = _ref.fields,
      updateDefaults = _ref.updateDefaults;
  return /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2, _ref3) {
      var commit, payload, id, document, result;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref2.commit;
              payload = _ref3.payload, id = _ref3.id;
              payload = _objectSpread2(_objectSpread2({}, payload), setDefaults(updateDefaults));
              _context.prev = 3;
              _context.next = 6;
              return collection.findOne(id).exec();

            case 6:
              document = _context.sent;

              if (document) {
                _context.next = 9;
                break;
              }

              throw statusResponse(404, 'Not found');

            case 9:
              getFieldsByType(fields, 'nested', function (_ref5) {
                var name = _ref5.name;
                payload[name] = nestField(payload[name]);
              });
              _context.next = 12;
              return document.update({
                $set: payload
              });

            case 12:
              result = _objectSpread2(_objectSpread2({}, document.toJSON()), payload);
              commit('replaceItem', result);
              return _context.abrupt("return", formatResponse({
                result: result
              }));

            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](3);
              throw formatError(_context.t0);

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 17]]);
    }));

    return function (_x, _x2) {
      return _ref4.apply(this, arguments);
    };
  }();
}

function replace (module, collection) {
  return update(module, collection);
}

var actions = {
  create: create,
  destroy: destroy,
  fetchFilters: fetchFilters,
  fetchList: fetchList,
  fetchSingle: fetchSingle,
  replace: replace,
  update: update
};

function getters (_ref) {
  var getters = _ref.getters,
      idKey = _ref.idKey;
  return _objectSpread2({
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
          return item[idKey] === id;
        });
      };
    }
  }, getters);
}

function mutations (_ref) {
  var idKey = _ref.idKey,
      mutations = _ref.mutations,
      perPage = _ref.perPage;
  return _objectSpread2({
    setFilters: function setFilters(state, payload) {
      state.filters = payload;
    },
    setList: function setList(state, _ref2) {
      var count = _ref2.count,
          increment = _ref2.increment,
          _ref2$results = _ref2.results,
          results = _ref2$results === void 0 ? [] : _ref2$results;

      if (increment) {
        var _state$list;

        (_state$list = state.list).push.apply(_state$list, _toConsumableArray(results));
      } else {
        state.list = results;
      }

      state.totalPages = Math.ceil(count / perPage);
    },
    setListItem: function setListItem(state) {
      var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      state.list.push(payload);
    },
    setErrors: function setErrors(state, _ref3) {
      var model = _ref3.model,
          hasError = _ref3.hasError;
      state[model] = !!hasError;
    },
    replaceItem: function replaceItem(state, payload) {
      var index = state.list.findIndex(function (item) {
        return item[idKey] === payload[idKey];
      });
      ~index ? state.list.splice(index, 1, payload) : state.list.push(payload);
    },
    removeListItem: function removeListItem(state, id) {
      var index = state.list.findIndex(function (item) {
        return item[idKey] === id;
      });
      ~index && state.list.splice(index, 1);
    }
  }, mutations);
}

function state (_ref) {
  var state = _ref.state;
  return _objectSpread2({
    list: [],
    filters: {},
    totalPages: 0
  }, state);
}

function createDateTime () {
  return new Date().toISOString();
}

function createUUID () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (_char) {
    return (_char ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> _char / 4).toString(16);
  });
}

var _default = /*#__PURE__*/function () {
  function _default() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _default);

    if (!options.database.name) {
      throw new Error('Name is required.');
    }

    this.database = null;
    this.databaseOptions = options.database;
    this.idKey = options.idKey || 'id';
    this.perPage = options.perPage || 12;
    this.collections = {};
    this.modules = options.modules || [];
    this.storeModules = {}; // Middleware-hooks
    // https://rxdb.info/middleware.html

    this.hooks = options.hooks || ['preInsert', 'postInsert', 'preSave', 'postSave', 'preRemove', 'postRemove', 'postCreate']; // Types

    this.types = options.types || ['CREATE', 'DESTROY', 'FETCH_FILTERS', 'FETCH_LIST', 'FETCH_SINGLE', 'REPLACE', 'UPDATE'];
  }

  _createClass(_default, [{
    key: "addDatabasePlugin",
    value: function addDatabasePlugin() {
      for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
        plugins[_key] = arguments[_key];
      }

      for (var _i = 0, _plugins = plugins; _i < _plugins.length; _i++) {
        var plugin = _plugins[_i];
        addRxPlugin(plugin);
      }
    }
  }, {
    key: "createDatabase",
    value: function () {
      var _createDatabase = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Custom Build
                // https://rxdb.info/custom-build.html
                this.addDatabasePlugin(RxDBValidatePlugin, RxDBQueryBuilderPlugin, RxDBMigrationPlugin, RxDBReplicationPlugin, RxDBLeaderElectionPlugin, RxDBUpdatePlugin, require('pouchdb-adapter-idb'));

                if (process.env.DEBUGGING) {
                  this.addDatabasePlugin(require('rxdb/plugins/dev-mode').RxDBDevModePlugin);
                }

                _context.next = 4;
                return createRxDatabase(_objectSpread2({
                  adapter: 'idb'
                }, this.databaseOptions));

              case 4:
                this.database = _context.sent;

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createDatabase() {
        return _createDatabase.apply(this, arguments);
      }

      return createDatabase;
    }()
  }, {
    key: "destroyDatabase",
    value: function destroyDatabase() {
      return this.database.destroy();
    }
  }, {
    key: "setupCollections",
    value: function () {
      var _setupCollections = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var collections, _iterator, _step, module, _iterator2, _step2, _module;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                collections = {};
                _iterator = _createForOfIteratorHelper(this.modules);

                try {
                  for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    module = _step.value;
                    collections[module.name] = module;
                  }
                } catch (err) {
                  _iterator.e(err);
                } finally {
                  _iterator.f();
                }

                _context2.next = 5;
                return this.database.addCollections(collections);

              case 5:
                this.collections = _context2.sent;
                _iterator2 = _createForOfIteratorHelper(this.modules);

                try {
                  for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                    _module = _step2.value;
                    this.storeModules[_module.name] = this.createStoreModule(_module);
                  }
                } catch (err) {
                  _iterator2.e(err);
                } finally {
                  _iterator2.f();
                }

              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setupCollections() {
        return _setupCollections.apply(this, arguments);
      }

      return setupCollections;
    }()
  }, {
    key: "createStoreModule",
    value: function createStoreModule() {
      var module = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      module.parent = this;
      var collection = this.getCollectionByName(module.name);
      module.idKey = module.idKey || this.idKey;
      module.perPage = module.perPage || this.perPage; // Hooks

      var hooks = module.hooks || {};

      var _iterator3 = _createForOfIteratorHelper(this.hooks),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var name = _step3.value;
          var hook = hooks[name];

          if (Array.isArray(hook)) {
            collection[name].apply(collection, _toConsumableArray(hook));
          } else if (typeof hook === 'function') {
            collection[name](hook, false);
          }
        } // Types

      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var types = module.types || this.types;

      var has = function has(type) {
        return types.includes(type);
      }; // Params


      var params = [module, collection];
      return {
        namespaced: true,
        actions: {
          create: has('CREATE') && actions.create.apply(actions, params),
          destroy: has('DESTROY') && actions.destroy.apply(actions, params),
          fetchFilters: has('FETCH_FILTERS') && actions.fetchFilters.apply(actions, params),
          fetchList: has('FETCH_LIST') && actions.fetchList.apply(actions, params),
          fetchSingle: has('FETCH_SINGLE') && actions.fetchSingle.apply(actions, params),
          replace: has('REPLACE') && actions.replace.apply(actions, params),
          update: has('UPDATE') && actions.update.apply(actions, params)
        },
        getters: getters.apply(void 0, params),
        mutations: mutations.apply(void 0, params),
        state: state.apply(void 0, params)
      };
    }
  }, {
    key: "getCollections",
    value: function getCollections() {
      return this.collections;
    }
  }, {
    key: "getCollectionByName",
    value: function getCollectionByName(name) {
      return this.collections[name];
    }
  }, {
    key: "getStoreModules",
    value: function getStoreModules() {
      return this.storeModules;
    }
  }]);

  return _default;
}();

export default _default;
export { createDateTime, createUUID, nestField };
