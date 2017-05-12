import React, { Component, PropTypes } from 'react'
import { getValueFromEvent } from './utils'
import { toJS, extendObservable } from 'mobx'
import AsyncValidator from 'async-validator'

const DEFAULT_VALIDATE_TRIGGER = 'onChange';
const DEFAULT_TRIGGER = DEFAULT_VALIDATE_TRIGGER;

let __counter = 1

function createForm(options = {}) {
  const { 
    store: gStore, 
    prefix = '', 
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

      state = {
        errors: {},
      }

      fieldOptions = {}
      subCb = new Set()
      store = {}

      getChildContext() {
        return { form: this, defaultItemProps, displayDefaultLabel }
      }

      getTargetFields() {
        const store = this.getStore()
        return prefix ? store[prefix] : store
      }

      subscribe(cb) {
        this.subCb.add(cb)
      }

      unsubscribe(cb) {
        this.subCb.delete(cb)
      }

      getResetErrors() {
        return Object.keys(this.state.errors).reduce((o, name) => {
          o[name] = []
          return o
        }, {})
      }

      validateField(name, value, rules) {
        if (!rules) return;
        const validator = new AsyncValidator({ [name]: rules })
        validator.validate({ [name]: value }, (err, fields) => {
          this.setState(({ errors }) => ({
            errors: { ...errors, [name]: err || [] }
          }))
        })
      }

      validateFields = (callback) => {
        const validator = new AsyncValidator(
          Object.keys(this.fieldOptions).reduce((o, name) => {
            const rules = this.fieldOptions[name].rules
            if (rules) o[name] = rules
            return o
          }, {})
        )
        return new Promise((res, rej) => {
          const values = toJS(this.getTargetFields())
          validator.validate(values, (err, fields) => {
            this.setState(({ errors }) => ({ errors: Object.assign({}, errors, fields) }), () => {
              for (const cb of this.subCb) {
                cb()
              }
            })
            if (fields) {
              callback ? callback(fields) : rej(fields)
            } else {
              res(values)
            }
          })
        })
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
          validate: [],
          trigger: DEFAULT_TRIGGER,
          validateTrigger: DEFAULT_VALIDATE_TRIGGER,
          appendProps: {},
          ...options,
          ...customFieldOption,
        };

        const {
          trigger,
          validateTrigger,     // not support now
          validate,
          valuePropName,
          parseValue,
          appendProps,
          initialValue,
        } = fieldOption;

        if (!(name in store)) extendObservable(store, { [name]: initialValue })

        const value = this.getTargetFields()[name]
        this.fieldOptions[name] = fieldOption
        return {
          [valuePropName]: parseValue ? parseValue(value) : toJS(value),
          [trigger]: this.createHandler(fieldOption),
          ['data-field-name']: name,
          ...appendProps,
        }
      }

      createHandler({ name, onChange, rules, getValueFromEvent }) {
        return (...params) => {
          const value = getValueFromEvent(...params)
          onChange && onChange(value)
          this.validateField(name, value, rules)
          this.getTargetFields()[name] = value
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
            __counter={__counter++}
          />
        )
      }
    }
    return WrapForm
  }

  return decorate
}

export default createForm