/**
 * Created by Frezc on 2017/3/19.
 */
import { observable } from 'mobx'

class DemoForm {
  // auto injection
  // @observable nest = { input: '' }
  @observable select;
  @observable selectMultiple;
  @observable inputNumber = 3;
  @observable switch;
  @observable slider;
  @observable radioGroup;
  @observable radioButton;
  @observable upload;

  // use getter can prevent to be converted by toJS
  get __options() {
    // you can set options at here
    return {
      selectMultiple: {
        rules: { required: true, message: 'Please select your colors!' },
        appendProps: {
          mode: 'multiple',
          placeholder: "Please select favourite colors",
        },
      }
    }
  } 
}

export default DemoForm