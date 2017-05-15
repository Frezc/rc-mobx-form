import React, { PropTypes } from 'react'
import Form from 'antd/lib/form'
import { checkIsRequired } from './utils'
import { observer } from 'mobx-react'

const FormItem = Form.Item

@observer
class MobxFormItem extends React.Component {

  static contextTypes = {
    form: PropTypes.object,
    defaultItemProps: PropTypes.object,
    displayDefaultLabel: PropTypes.bool,
  }

  render() {
    let fieldOption;
    const children = React.Children.toArray(this.props.children)
    for (const child of children) {
      const childFieldOption = this.context.form.fieldOptions[child.props && child.props['data-field-name']]
      if (childFieldOption && typeof childFieldOption === 'object') {
        fieldOption = childFieldOption
        break
      }
    }
    
    const appendProps = {}
    if (fieldOption && !this.props.disabledValidate) {
      const name = fieldOption.name

      if (this.context.displayDefaultLabel && this.props.label === undefined) {
        appendProps.label = name
      }

      const err = this.context.form.errors.get(name)
      if (err) {
        appendProps.validateStatus = err.length > 0 ? 'error' : 'success'
      }
      appendProps.required = checkIsRequired(fieldOption.rules)
      appendProps.help = appendProps.validateStatus === 'error' &&
          err.map(({ message }) => message).join(' ')
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