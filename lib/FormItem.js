'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _antd = require('antd');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormItem = _antd.Form.Item;

var MobxFormItem = (_temp2 = _class = function (_React$PureComponent) {
  _inherits(MobxFormItem, _React$PureComponent);

  function MobxFormItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MobxFormItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MobxFormItem.__proto__ || Object.getPrototypeOf(MobxFormItem)).call.apply(_ref, [this].concat(args))), _this), _this.update = function () {
      _this.forceUpdate();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MobxFormItem, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.context.form.subscribe(this.update);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.context.form.unsubscribe(this.update);
    }
  }, {
    key: 'render',
    value: function render() {
      var fieldOption = void 0;
      var children = _react2.default.Children.toArray(this.props.children);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;

          var childFieldOption = this.context.form.fieldOptions[child.props['data-field-name']];
          if (childFieldOption && (typeof childFieldOption === 'undefined' ? 'undefined' : _typeof(childFieldOption)) === 'object') {
            fieldOption = childFieldOption;
            break;
          }
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

      var appendProps = {};
      if (fieldOption) {
        var name = fieldOption.name;
        var err = this.context.form.state.errors[name];
        if (err) {
          appendProps.validateStatus = err.length > 0 ? 'error' : 'success';
        }
        appendProps.required = (0, _utils.checkIsRequired)(fieldOption.rules);
        appendProps.help = appendProps.validateStatus === 'error' && err.map(function (_ref2) {
          var message = _ref2.message;
          return message;
        }).join(' ');
      }

      return _react2.default.createElement(FormItem, _extends({}, this.context.defaultItemProps, this.props, appendProps));
    }
  }]);

  return MobxFormItem;
}(_react2.default.PureComponent), _class.contextTypes = {
  form: _react.PropTypes.object,
  defaultItemProps: _react.PropTypes.object
}, _temp2);
exports.default = MobxFormItem;