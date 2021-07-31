const store = {}

function createStore(name, initialState) {
  store[name] = {state: initialState, listeners: []}
}

function update(name, updator) {
  const selectedStore = store[name];
  selectedStore.state = updator(selectedStore.state)
  selectedStore.listeners.forEach(listener => listener(selectedStore.state))
}

function getState(name) {
  return store[name].state
}

function subscribe(name, onChange) {
  store[name].listeners.push(onChange)
}

export {
  createStore,
  update,
  subscribe,
  getState
}