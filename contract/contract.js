const functions = { click }

export function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action)
  }
  throw new ContractError('function not defined!')
}

function click(state, action) {
  state.clicks = state.clicks + 1;
  return { state }
}