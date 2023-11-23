export function SET_LOGS(state, data) {
  state.logs = data;
}

export function SET_LOGITEMS(state, data) {
  state.logItems = data;
}

export function DELETE_LOGS(state, date) {
  let logs = state.logs.filter((v) => v.date != date);
  state.logs = logs;
}
