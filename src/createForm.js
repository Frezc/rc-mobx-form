import React, { Component } from 'react'
import { getValueFromEvent } from './utils'
import { toJS } from 'mobx'
import { PropTypes as MobPropTypes } from 'mobx-react'

const DEFAULT_VALIDATE_TRIGGER = 'onChange';
const DEFAULT_TRIGGER = DEFAULT_VALIDATE_TRIGGER;

function createForm(options = {}) {
  const { store, prefix = '' } = options

  function decorate(WrappedComponent) {

    class WrapForm extends Component {

      static propTypes = {
        store: MobPropTypes.observableObject.isRequired
      }

      state = {
        error: {},
      }

      getTargetStore(store) {
        return prefix ? store[prefix] : store
      }

      validateField() {

      }

      getFieldProps = (name, customFieldOption = {}) => {
        const store = customFieldOption.store || this.props.store || store
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
          valuePropName
        } = fieldOption;

        const value = this.getTargetStore(store)[name]
        return {
          [valuePropName]: typeof value === 'number' ? String(value) : toJS(value),
          [trigger]: this.createHandler(store, fieldOption),
          __MOBX_FORM__: true,
        }
      }

      createHandler(store, { name, onChange, rules, getValueFromEvent }) {
        return (...params) => {
          const value = getValueFromEvent(...params)
          onChange && onChange(value)
          console.log('changed', value)
          this.validateField(value, rules)
          this.getTargetStore(store)[name] = value
          console.log('store', toJS(this.getTargetStore(store)))
        }
      }

      render() {
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