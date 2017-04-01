/**
 * Created by Frezc on 2017/3/19.
 */
import { observable } from 'mobx'

class DemoForm {
  @observable select;
  @observable selectMultiple;
  @observable inputNumber = 3;
  @observable switch;
  @observable slider;
  @observable radioGroup;
  @observable radioButton;
  @observable upload;

  // you can set options at here
  __options = {
  	selectMultiple: {
      rules: { required: true, message: 'Please select your colors!' }
  	}
  }
}

export default DemoForm