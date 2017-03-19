'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValueFromEvent = getValueFromEvent;
exports.checkIsRequired = checkIsRequired;
function getValueFromEvent(e) {
  // support custom element
  if (!e || !e.target) {
    return e;
  }
  var target = e.target;

  return target.type === 'checkbox' ? target.checked : target.value;
}

function checkIsRequired(rules) {
  if (rules) {
    if (Array.isArray(rules)) return !!rules[0].required;
    return !!rules.required;
  }
  return false;
}