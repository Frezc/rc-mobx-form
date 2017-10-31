import React, { Component, PropTypes } from 'react'
import { getValueFromEvent } from './utils'
import { toJS, extendObservable, action, observable } from 'mobx'
import AsyncValidator from 'async-validator'
import { set, get, has } from 'lodash';

const DEFAULT_VALIDATE_TRIGGER = 'onChange';
const DEFAULT_TRIGGER = DEFAULT_VALIDATE_TRIGGER;

function createForm(options = {}) {
  const { 
    store: gStore, 
    prefix = '',    // support lodash.get
    defaultItemProps = {},
    displayDefaultLabel = true
  } = options

  function decorate(WrappedComponent) {

    class WrapForm extends Component {

      static childContextTypes = {
        form: PropTypes.object,
        defaultItemProps: PropTypes.object,
        displayDefaultLabel: PropTypes.bool,
      }

      errors = observable.map()
      fieldOptions = {}
      store = {}

      validateFields = (callback) => {
        const needValidateName = []
        const rules = Object.keys(this.fieldOptions).reduce((o, name) => {
          const rules = this.fieldOptions[name].rules
          if (rules) {
            needValidateName.push(name)
            o[name] = rules
          }
          return o
        }, {})
        const validator = new AsyncValidator(rules)
        return new Promise((res, rej) => {
          const values = toJS(this.getTargetFields())
          // flatten values that need validate
          const flattenValue = needValidateName.reduce((o, cur) => {
            o[cur] = this.getField(cur)
            return o
          }, {})
          validator.validate(flattenValue, action((err, fields) => {
            this.errors.merge(fields)
            if (fields) {
              callback ? callback(fields) : rej(fields)
            } else {
              res(values)
            }
          }))
        })
      }

      getFieldError = (name) => {
        return this.errors.get(name)
      }

      /**
       * not support filter name now
       */
      getFieldsError = () => {
        return this.errors.toJS()
      }

      getStore = () => {
        return this.props.store || gStore || this.store
      }

      getFieldProps = (name, customFieldOption = {}) => {
        const store = this.getStore()
        if (!store) throw new Error('Must pass `store` with Mobx instance.')
        if (!name) {
          throw new Error('Must call `getFieldProps` with valid name string!');
        }

        const options = (store.__options && store.__options[name]) || {}

        const fieldOption = {
          getValueFromEvent,
          name,
          valuePropName: 'value',
          trigger: DEFAULT_TRIGGER,
          validateTrigger: DEFAULT_VALIDATE_TRIGGER,
          appendProps: {},
          ...options,
          ...customFieldOption,
        };

        const {
          trigger,
          validateTrigger,
          valuePropName,
          parseValue,
          appendProps,
          initialValue,
        } = fieldOption;

        const path = prefix ? `${prefix}.${name}` : name;

        if (!has(store, path))
          extendObservable(store, set({}, path, initialValue))

        const value = this.getField(name)
        this.fieldOptions[name] = fieldOption

        const props = {
          [valuePropName]: parseValue ? parseValue(value) : toJS(value),
          [trigger]: this.createHandler(fieldOption, validateTrigger === trigger),
          ['data-field-name']: name,
          ...appendProps,
        }

        if (validateTrigger !== trigger) props[validateTrigger] = this.createValidateHandler(fieldOption)
        return props
      }

      getChildContext() {
        return { form: this, defaultItemProps, displayDefaultLabel }
      }

      getTargetFields() {
        const store = this.getStore()
        return prefix ? get(store, prefix) : store
      }

      getField(path, defaultValue) {
        const store = this.getStore()
        return get(store, prefix ? `${prefix}.${path}` : path, defaultValue)
      }

      setField(path, value) {
        const store = this.getStore()
        return set(store, prefix ? `${prefix}.${path}` : path, value)
      }

      getResetErrors() {
        return this.errors.keys().reduce((o, name) => {
          o[name] = []
          return o
        }, {})
      }

      validateField(name, value, rules) {
        if (!rules) return;
        const validator = new AsyncValidator({ [name]: rules })
        validator.validate({ [name]: value }, action('validateField', (err, fields) => {
          this.errors.set(name, err || [])
        }))
      }

      createHandler({ name, onChange, rules, getValueFromEvent }, needValidate = false) {
        return (...params) => {
          const value = getValueFromEvent(...params)
          onChange && onChange(value)
          needValidate && this.validateField(name, value, rules)
          this.setField(name, value)
        }
      }

      createValidateHandler({ name, rules, getValueFromEvent }) {
        return (...params) => {
          const value = getValueFromEvent(...params)
          this.validateField(name, value, rules)
        }
      }

      render() {
        // 每次重新render时要清除已经不存在的项
        this.fieldOptions = {}
        // use __counter to force update
        // because mobx will prevent update of Component when prop not changed.
        return (
          <WrappedComponent
            {...this.props}
            form={this}
            ref={this.props.rootRef}
          />
        )
      }
    }
    return WrapForm
  }

  return decorate
}

export default createForm