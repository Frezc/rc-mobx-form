export function getValueFromEvent(e) {
  // support custom element
  if (!e || !e.target) {
    return e;
  }
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}

export function checkIsRequired(rules) {
  if (rules) {
    if (Array.isArray(rules)) return !!rules[0].required
    return !!rules.required
  }
  return false
}