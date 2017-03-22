import React, { Component, PropTypes } from 'react'
import { getValueFromEvent } from './utils'
import { toJS } from 'mobx'
import AsyncValidator from 'async-validator'

const DEFAULT_VALIDATE_TRIGGER = 'onChange';
const DEFAULT_TRIGGER = DEFAULT_VALIDATE_TRIGGER;

function createForm(options = {}) {
  const { store, prefix = '', defaultItemProps = {} } = options

  function decorate(WrappedComponent) {

    class WrapForm extends Component {

      static childContextTypes = {
        form: PropTypes.object,
        defaultItemProps: PropTypes.object
      }

      state = {
        errors: {},
      }

      fieldOptions = {}
      subCb = new Set()

      getChildContext() {
        return { form: this, defaultItemProps }
      }

      getTargetFields(store = this.props.store || store) {
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
          validator.validate(toJS(this.getTargetFields()), (err, fields) => {
            this.setState(({ errors }) => ({ errors: Object.assign({}, errors, fields) }), () => {
              for (const cb of this.subCb) {
                cb()
              }
            })
            if (fields) {
              callback ? callback(fields) : rej(fields)
            } else {
              res()
            }
          })
        })
      }

      getFieldProps = (name, customFieldOption = {}) => {
        const store = this.props.store || store
        if (!store) throw new Error('Must pass `store` with Mobx instance.')
        if (!name) {
          throw new Error('Must call `getFieldProps` with valid name string!');
        }

        const fieldOption = {
          valuePropName: 'value',
          validate: [],
          trigger: DEFAULT_TRIGGER,
          validateTrigger: DEFAULT_VALIDATE_TRIGGER,
          getValueFromEvent,
          name,
          ...customFieldOption,
        };

        const {
          trigger,
          validateTrigger,     // not support now
          validate,
          valuePropName,
          parseValue
        } = fieldOption;

        const value = this.getTargetFields(store)[name]
        this.fieldOptions[name] = fieldOption
        return {
          [valuePropName]: parseValue ? parseValue(value) : toJS(value),
          [trigger]: this.createHandler(store, fieldOption),
          ['data-field-name']: name
        }
      }

      createHandler(store, { name, onChange, rules, getValueFromEvent }) {
        return (...params) => {
          const value = getValueFromEvent(...params)
          onChange && onChange(value)
          this.validateField(name, value, rules)
          this.getTargetFields(store)[name] = value
        }
      }

      render() {
        this.fieldOptions = {}
        return (
          <WrappedComponent
            {...this.props}
            form={this}
          />
        )
      }
    }
    return WrapForm
  }

  return decorate
}

export default createForm