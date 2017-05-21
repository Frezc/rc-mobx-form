import React, { PropTypes } from 'react'
import { checkIsRequired } from './utils'
import { observer } from 'mobx-react'

let FormItem = null

/**
 * set the internal FormItem component that be used in rc-mobx-form
 * @param fi FormItem Component
 */
export function setInternalFormItem(fi) {
  FormItem = fi
}

@observer
class MobxFormItem extends React.Component {

  static propTypes = {
    disabledValidate: PropTypes.bool,           // disable validate message ?
  }

  static defaultProps = {
    disabledValidate: false,
  }

  static contextTypes = {
    form: PropTypes.object,                     // the form object
    defaultItemProps: PropTypes.object,         // global default FormItem props
    displayDefaultLabel: PropTypes.bool,        // display the default label if not set
  }

  render() {
    if (!FormItem) throw new Error('You must set the FormItem by `useFormItem` function in entry file.')

    let fieldOption;
    const children = React.Children.toArray(this.props.children)
    // get the first form component that bind props
    for (const child of children) {
      const childFieldOption = this.context.form.fieldOptions[child.props && child.props['data-field-name']]
      if (childFieldOption && typeof childFieldOption === 'object') {
        fieldOption = childFieldOption
        break
      }
    }
    
    const appendProps = {}
    if (fieldOption) {
      const name = fieldOption.name

      // display default label ?
      if (this.context.displayDefaultLabel && this.props.label === undefined) {
        appendProps.label = name
      }

      // set validate status
      if (!this.props.disabledValidate) {
        const err = this.context.form.errors.get(name)
        if (err) {
          appendProps.validateStatus = err.length > 0 ? 'error' : 'success'
        }
        appendProps.required = checkIsRequired(fieldOption.rules)
        appendProps.help = appendProps.validateStatus === 'error' &&
          err.map(({ message }) => message).join(' ')
      }
    }

    return (
      <FormItem
        {...this.context.defaultItemProps}
        {...appendProps}
        {...this.props}
      />
    )
  }
}

export default MobxFormItem