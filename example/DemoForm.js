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
}

export default DemoForm