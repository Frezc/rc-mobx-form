# rc-mobx-form

Inspiration from [rc-form](https://github.com/react-component/form)

Depend on react, mobx and async-validator.

## Why use this ?
- You are familiar with rc-form and want to use it with mobx.
- Many layers of nested form you want to manage fields together.
ep. you can use store to manage nested form fields.

## todo
- [x] Support object path.
- [x] Support default observer object in form.
- [x] add doc.
- [x] Support validateTrigger.
- [x] remove ant-design dependency
- [x] reduce example js size

## example

[online](https://frezc.github.io/rc-mobx-form/example/index.html)

## Usage
```
npm i -S rc-mobx-form
```

```javascript
import { createForm, FormItem, setInternalFormItem } from 'rc-mobx-form'

// if you use ant-design
import { Form } from 'antd'
setInternalFormItem(Form.Item)

// if not, you can implement FormItem instead of default FormItem (see implementation of /src/FormItem.js)
import FormItem from 'your-implement-form-item'
```

```javascript
import { observer } from 'mobx-react'

// below is almost same with rc-form, @observer is necessary
@observer
class MyForm extend Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(fields => console.log('error', fields))
        .then((values) => console.log('success', values))
  }

  render() {
    const { getFieldProps } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem hasFeedback>
          <Input
            {...getFieldProps('nest.input', {
              rules: { required: true, message: 'Please input something!' },
              validateTrigger: 'onBlur',
            })}
            placeholder="Input here"
          />
        </FormItem>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form>
    )
  }
}

const WrappedForm = createForm()(MyForm)

render(<WrappedForm />, targetEl)
```

you can also pass a store to WrappedForm
```javascript
import { observable } from 'mobx'

class DemoForm {
  @observable nest = { input: '' }

  get __options() {
    // you can set options at here
    return {
      'nest.input': {
        rules: { required: true, message: 'Please input something!' },
        validateTrigger: 'onBlur',
        appendProps: {
          placeholder: 'Input here',
        },
      }
    }
  } 
}

// if you set the __options, the above MyForm's render() look like
render() {
  const { getFieldProps } = this.props.form
  return (
    <Form onSubmit={this.handleSubmit}>
      <FormItem hasFeedback>
        <Input {...getFieldProps('nest.input')} />
      </FormItem>
      <Button type="primary" htmlType="submit">Submit</Button>
    </Form>
  )
}

// and you need to pass store to WrappedForm
render(<WrappedForm store={new DemoForm()} />, targetEl)
```

## API

### createForm(options)(FormComponent) : WrapForm
#### options
- store: you can also pass store here.
- prefix: common prefix path in store.
- defaultItemProps: default props assign to FormItem in this FormComponent.
- displayDefaultLabel: display the default label (passed name) in FormItem.

#### WrapForm's props
- store: you can pass store here.
- rootRef: ref of FormComponent

#### WrapForm's method
- validateFields(callback: Function) : Promise
- getFieldError(name) : Object
- getFieldsError() : Object
- getStore()
- getFieldProps(name, fieldOptions: Object)

#### fieldOptions
see ant-design's [doc](https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters)
but something different:

- exclusive not supported
- add parseValue: Function, can be used to format value before set to component
- add appendProps: Object, for __options of store, this will assign to target component's props

#### FormItem
- disabledValidate, if need disable validateStatus
