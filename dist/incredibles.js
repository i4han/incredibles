
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _path = require('path');

if ('undefined' === typeof Meteor) {
    var bypassRequire = require;
    bypassRequire('underscore2');
}

var anyIs = function anyIs(answer, o) {
    for (var _len = arguments.length, fn = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        fn[_key - 2] = arguments[_key];
    }

    return fn.length === 0 ? answer ? true : false : fn.length === 1 ? answer ? __.isFunction(fn[0]) ? fn[0](o) : fn[0] : false : fn.length === 2 ? answer ? __.isFunction(fn[0]) ? fn[0](o) : fn[0] : __.isFunction(fn[1]) ? fn[1](o) : fn[1] : console.log('error: is');
};

var anyTypeOf = function anyTypeOf(answer, type, o) {
    for (var _len2 = arguments.length, fn = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        fn[_key2 - 3] = arguments[_key2];
    }

    return fn.length === 0 ? answer === type ? true : false : fn.length === 1 ? answer === type ? __.isFunction(fn[0]) ? fn[0](o) : fn[0] : false : fn.length === 2 ? answer === type ? __.isFunction(fn[0]) ? fn[0](o) : fn[0] : __.isFunction(fn[1]) ? fn[1](o) : fn[1] : console.log('error: typeof');
};

Function.prototype.typeof = function (type) {
    for (var _len3 = arguments.length, fn = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        fn[_key3 - 1] = arguments[_key3];
    }

    return anyTypeOf.apply(undefined, ['function', type, {}].concat(fn));
};
// Function.prototype.is = (f, ...fn) => anyIs(f.toString === this.toString, this, fn)

var incObject = function (_Object) {
    _inherits(incObject, _Object);

    function incObject() {
        var _ref;

        _classCallCheck(this, incObject);

        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
        }

        return _possibleConstructorReturn(this, (_ref = incObject.__proto__ || Object.getPrototypeOf(incObject)).call.apply(_ref, [this].concat(args)));
    }

    _createClass(incObject, [{
        key: 'keys',
        value: function keys() {
            return Object.keys(this);
        }
    }, {
        key: 'is',
        value: function is(obj) {
            for (var _len5 = arguments.length, fn = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
                fn[_key5 - 1] = arguments[_key5];
            }

            return anyIs.apply(undefined, [Object.is(this, obj), this].concat(fn));
        }
    }, {
        key: 'typeof',
        value: function _typeof(type) {
            for (var _len6 = arguments.length, fn = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
                fn[_key6 - 1] = arguments[_key6];
            }

            return anyTypeOf.apply(undefined, ['object', type, this].concat(fn));
        }
    }, {
        key: 'remove',
        value: function remove(key) {
            var _this2 = this;

            if (__.isArray(key)) key.map(function (v) {
                return delete _this2[v];
            });else delete this[key];
            return this;
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            return this.add(key, value);
        }
    }, {
        key: 'add',
        value: function add(key, value) {
            var _this3 = this;

            if (__.isString(key) && key.includes('.') && key.indexOf('.') && key[key.length - 1] !== '.') {
                var re = key.match(/^([^.]+)\.(.*$)/);
                var _ref2 = [re[1], re[2]],
                    firstKey = _ref2[0],
                    restKey = _ref2[1];

                this[firstKey] = this[firstKey] || new incObject();
                this[firstKey].add(restKey, value);
            } else if (__.isObject(key) && __.isUndefined(value)) for (var k in key) {
                this[k] = key[k];
            } // recursive obj reference assign
            else if (__.isScalar(key)) this[key] = value; // this one need to copy not reference
                else if (__.isArray(key)) if (__.isArray(value)) key.map(function (v, i) {
                        return _this3[v] = value[i];
                    });else if (__.isUndefined(value)) this[key[0]] = key[1];else console.log('add error: add(array, value)');
            return this;
        }
    }, {
        key: 'rekey',
        value: function rekey(oldKey, newKey) {
            if (this.hasOwnProperty(oldKey)) {
                this[newKey] = this[oldKey];
                delete this[oldKey];
            }
            return this;
        }
    }, {
        key: 'fnValue',
        value: function fnValue(self) {
            var _this4 = this;

            this.keys().forEach(function (v) {
                return _this4[v] = __.isFunction(_this4[v]) ? _this4[v](self) : __.isObject(_this4[v]) ? in$(_this4[v]).fnValue(self) : _this4[v];
            });
            return this;
        }
    }]);

    return incObject;
}(Object);

var incArray = function (_Array) {
    _inherits(incArray, _Array);

    function incArray() {
        var _ref3;

        _classCallCheck(this, incArray);

        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
        }

        return _possibleConstructorReturn(this, (_ref3 = incArray.__proto__ || Object.getPrototypeOf(incArray)).call.apply(_ref3, [this].concat(args)));
    }

    _createClass(incArray, [{
        key: 'typeof',
        value: function _typeof(type) {
            for (var _len8 = arguments.length, fn = Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
                fn[_key8 - 1] = arguments[_key8];
            }

            return anyTypeOf.apply(undefined, ['array', type, this].concat(fn));
        }
    }, {
        key: 'is',
        value: function is(a) {
            var _this6 = this;

            for (var _len9 = arguments.length, fn = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
                fn[_key9 - 1] = arguments[_key9];
            }

            return anyIs.apply(undefined, [function () {
                if (_this6.length !== a.length) return false;
                for (var i = 0; i < _this6.length; i++) {
                    if (_this6[i] !== a[i]) return false;
                }return true;
            }(), this].concat(fn));
        }
    }, {
        key: 'indexOf',
        value: function indexOf(f) {
            var fn = void 0;
            if (__.isFunction(f)) fn = f;else fn = function fn(arg) {
                return arg === f;
            };
            for (var i = 0; i < this.length; i++) {
                if (fn(this[i], i, this)) return i;
            }return -1;
        }
    }, {
        key: 'firstValue',
        value: function firstValue(f) {
            for (var i = in$(0); i < this.length; i++) {
                if (f(in$(this[i]), i, this)) return in$(this[i]);
            }return new incBoolean(false);
        }
    }, {
        key: 'unique',
        value: function unique(f) {
            var _this7 = this;

            f = f || function (v) {
                return function (w) {
                    return v === w;
                };
            };
            return this.filter(function (v, i) {
                return _this7.indexOf(f(v, i)) === i;
            });
        }
    }, {
        key: 'intersection',
        value: function intersection(b, f) {
            var bIndex = void 0;
            f = f || function (v) {
                return function (w) {
                    return v === w;
                };
            };
            return this.reduce(function (a, v, i) {
                if ((bIndex = b.indexOf(f(v, i))) !== -1) return a.concat(__.isObject(v) ? v.add(b[bIndex]) : v);else return a;
            }, new incArray());
        }
    }, {
        key: 'difference',
        value: function difference(b, f) {
            f = f || function (v) {
                return function (w) {
                    return v === w;
                };
            };
            return this.filter(function (v, i) {
                return b.indexOf(f(v, i)) === -1;
            });
        }
    }, {
        key: 'union',
        value: function union(b, f) {
            f = f || function (v) {
                return function (w) {
                    return v === w;
                };
            };
            return this.difference(b, f).concat(this.intersection(b, f)).concat(b.difference(this, f));
        }
    }, {
        key: 'coMap',
        value: function coMap(b, f) {
            var _this8 = this;

            return this.reduce(function (a, v, i) {
                a[i] = f(v, b[i], i, _this8);
                return a;
            }, new incArray());
        }
    }, {
        key: 'insert',
        value: function insert(i, v) {
            // if v is array?
            this.splice(i, 0, v);
            return this;
        }
    }, {
        key: 'delete',
        value: function _delete(i, n, v) {
            this.splice(i, n, v);
            return this;
        }
    }, {
        key: 'sum',
        value: function sum() {
            return this.reduce(function (a, v) {
                return a += v;
            }, 0);
        }
    }, {
        key: 'average',
        value: function average() {
            return this.length ? this.sum() / this.length : NaN;
        }
    }]);

    return incArray;
}(Array);

var incString = function (_String) {
    _inherits(incString, _String);

    function incString(arg) {
        _classCallCheck(this, incString);

        return _possibleConstructorReturn(this, (incString.__proto__ || Object.getPrototypeOf(incString)).call(this, arg));
    }

    _createClass(incString, [{
        key: 'is',
        value: function is(str) {
            for (var _len10 = arguments.length, fn = Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
                fn[_key10 - 1] = arguments[_key10];
            }

            return anyIs.apply(undefined, [str === this.valueOf(), this].concat(fn));
        }
    }, {
        key: 'typeof',
        value: function _typeof(type) {
            for (var _len11 = arguments.length, fn = Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
                fn[_key11 - 1] = arguments[_key11];
            }

            return anyTypeOf.apply(undefined, ['string', type, this].concat(fn));
        }
    }, {
        key: 'path',
        value: function path() {
            for (var _len12 = arguments.length, str = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                str[_key12] = arguments[_key12];
            }

            return in$(_path.join.apply(_path, [this.valueOf()].concat(_toConsumableArray(str.map(function (v) {
                return v.valueOf();
            })))));
        }
    }, {
        key: 'val',
        get: function get() {
            return this.valueOf();
        }
    }]);

    return incString;
}(String);

var incNumber = function (_Number) {
    _inherits(incNumber, _Number);

    function incNumber(arg) {
        _classCallCheck(this, incNumber);

        return _possibleConstructorReturn(this, (incNumber.__proto__ || Object.getPrototypeOf(incNumber)).call(this, arg));
    }

    _createClass(incNumber, [{
        key: 'is',
        value: function is(num) {
            for (var _len13 = arguments.length, fn = Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
                fn[_key13 - 1] = arguments[_key13];
            }

            return anyIs.apply(undefined, [num === this.valueOf(), this].concat(fn));
        }
    }, {
        key: 'typeof',
        value: function _typeof(type) {
            for (var _len14 = arguments.length, fn = Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
                fn[_key14 - 1] = arguments[_key14];
            }

            return anyTypeOf.apply(undefined, ['number', type, this].concat(fn));
        }
    }, {
        key: 'val',
        get: function get() {
            return this.valueOf();
        }
    }]);

    return incNumber;
}(Number);

var incBoolean = function (_Boolean) {
    _inherits(incBoolean, _Boolean);

    function incBoolean(arg) {
        _classCallCheck(this, incBoolean);

        return _possibleConstructorReturn(this, (incBoolean.__proto__ || Object.getPrototypeOf(incBoolean)).call(this, arg));
    }

    _createClass(incBoolean, [{
        key: 'is',
        value: function is(bool) {
            for (var _len15 = arguments.length, fn = Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
                fn[_key15 - 1] = arguments[_key15];
            }

            return anyIs.apply(undefined, [bool === this.valueOf(), this].concat(fn));
        }
    }, {
        key: 'typeof',
        value: function _typeof(type) {
            for (var _len16 = arguments.length, fn = Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) {
                fn[_key16 - 1] = arguments[_key16];
            }

            return anyTypeOf.apply(undefined, ['boolean', type, this].concat(fn));
        }
    }, {
        key: 'val',
        get: function get() {
            return this.valueOf();
        }
    }]);

    return incBoolean;
}(Boolean);

function in$(arg) {
    if (arg instanceof incObject || arg instanceof incArray || arg instanceof incString || arg instanceof incNumber || arg instanceof incBoolean) return arg;else if (__.isObject(arg)) {
        var i = new incObject();
        return i.set(arg);
    } else if (__.isArray(arg)) return new incArray().concat(arg);else if (__.isFunction(arg)) return arg;else if (__.isString(arg)) return new incString(arg);else if (__.isNumber(arg)) return new incNumber(arg); // NaN is not here
    else if (__.isBoolean(arg)) return new incBoolean(arg);else return arg;
} // null, undefined

module.exports = {incObject, incArray, in$};
