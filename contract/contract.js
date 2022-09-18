const functions = { visit }

export function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action)
  }
  throw new ContractError('function not defined!')
}

function visit(state, action) {
  state.views = state.views + 1;
  return { state }
}