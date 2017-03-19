'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('./utils');

var _mobx = require('mobx');

var _asyncValidator = require('async-validator');

var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_VALIDATE_TRIGGER = 'onChange';
var DEFAULT_TRIGGER = DEFAULT_VALIDATE_TRIGGER;

function createForm() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var store = options.store,
      _options$prefix = options.prefix,
      prefix = _options$prefix === undefined ? '' : _options$prefix,
      _options$defaultItemP = options.defaultItemProps,
      defaultItemProps = _options$defaultItemP === undefined ? {} : _options$defaultItemP;


  function decorate(WrappedComponent) {
    var _class, _temp2;

    var WrapForm = (_temp2 = _class = function (_Component) {
      _inherits(WrapForm, _Component);

      function WrapForm() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, WrapForm);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = WrapForm.__proto__ || Object.getPrototypeOf(WrapForm)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
          errors: {}
        }, _this.fieldOptions = {}, _this.subCb = new Set(), _this.validateFields = function (callback) {
          var validator = new _asyncValidator2.default(Object.keys(_this.fieldOptions).reduce(function (o, name) {
            var rules = _this.fieldOptions[name].rules;
            if (rules) o[name] = rules;
            return o;
          }, {}));
          return new Promise(function (res, rej) {
            validator.validate(_this.getTargetFields(), function (err, fields) {
              _this.setState(function (_ref2) {
                var errors = _ref2.errors;
                return { errors: Object.assign({}, errors, fields) };
              }, function () {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = _this.subCb[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var cb = _step.value;

                    cb();
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }
              });
              if (fields) {
                callback ? callback(fields) : rej(fields);
              } else {
                res();
              }
            });
          });
        }, _this.getFieldProps = function (name) {
          var _ref3;

          var customFieldOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          var store = _this.props.store || store;
          if (!store) throw new Error('Must pass `store` with Mobx instance.');
          if (!name) {
            throw new Error('Must call `getFieldProps` with valid name string!');
          }

          var fieldOption = _extends({
            valuePropName: 'value',
            validate: [],
            trigger: DEFAULT_TRIGGER,
            validateTrigger: DEFAULT_VALIDATE_TRIGGER,
            getValueFromEvent: _utils.getValueFromEvent,
            name: name
          }, customFieldOption);

          var trigger = fieldOption.trigger,
              validateTrigger = fieldOption.validateTrigger,
              validate = fieldOption.validate,
              valuePropName = fieldOption.valuePropName,
              parseValue = fieldOption.parseValue;


          var value = _this.getTargetFields(store)[name];
          _this.fieldOptions[name] = fieldOption;
          return _ref3 = {}, _defineProperty(_ref3, valuePropName, parseValue ? parseValue(value) : (0, _mobx.toJS)(value)), _defineProperty(_ref3, trigger, _this.createHandler(store, fieldOption)), _defineProperty(_ref3, 'data-field-name', name), _ref3;
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(WrapForm, [{
        key: 'getChildContext',
        value: function getChildContext() {
          return { form: this, defaultItemProps: defaultItemProps };
        }
      }, {
        key: 'getTargetFields',
        value: function getTargetFields() {
          var store = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.store || store;

          return prefix ? store[prefix] : store;
        }
      }, {
        key: 'subscribe',
        value: function subscribe(cb) {
          this.subCb.add(cb);
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe(cb) {
          this.subCb.delete(cb);
        }
      }, {
        key: 'getResetErrors',
        value: function getResetErrors() {
          return Object.keys(this.state.errors).reduce(function (o, name) {
            o[name] = [];
            return o;
          }, {});
        }
      }, {
        key: 'validateField',
        value: function validateField(name, value, rules) {
          var _this2 = this;

          if (!rules) return;
          var validator = new _asyncValidator2.default(_defineProperty({}, name, rules));
          validator.validate(_defineProperty({}, name, value), function (err, fields) {
            _this2.setState(function (_ref5) {
              var errors = _ref5.errors;
              return {
                errors: _extends({}, errors, _defineProperty({}, name, err || []))
              };
            });
          });
        }
      }, {
        key: 'createHandler',
        value: function createHandler(store, _ref6) {
          var _this3 = this;

          var name = _ref6.name,
              onChange = _ref6.onChange,
              rules = _ref6.rules,
              getValueFromEvent = _ref6.getValueFromEvent;

          return function () {
            var value = getValueFromEvent.apply(undefined, arguments);
            onChange && onChange(value);
            _this3.validateField(name, value, rules);
            _this3.getTargetFields(store)[name] = value;
          };
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.props, {
            form: this
          }));
        }
      }]);

      return WrapForm;
    }(_react.Component), _class.childContextTypes = {
      form: _react.PropTypes.object,
      defaultItemProps: _react.PropTypes.object
    }, _temp2);

    return WrapForm;
  }

  return decorate;
}

exports.default = createForm;