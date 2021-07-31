const PropsMap = {
  children: "innerHTML"
}

const Events = {
  SUBMIT: "submit",
  CLICK: "click"
}

function addListeners(el, events) {
  Object.keys(events).forEach(e => {
    el.addEventListener(e, events[e])
  })
}

function createElement(type, props = {}, events = {}) {
  const el = document.createElement(type);

  addListeners(el, events)

  Object.keys(props).forEach(key => {
    if (!!PropsMap[key]) {
      el[PropsMap[key]] = props[key]
      return el
    }
    el[key] = props[key]
  })

  return el
}

function append(parent, ...children) {
  children.forEach(el => {
    parent.appendChild(el)
  })

  return parent
}

export {
  createElement,
  append,
  Events
}