export function SET_ACTIVITY_LOGS(state, response) {
  state.activity_logs = response.data;
  state.pagination = {
    sortBy: response.meta.pagination.sortBy,
    descending: response.meta.pagination.descending,
    page: response.meta.pagination.current_page,
    size: response.meta.pagination.per_page,
    rowsNumber: response.meta.pagination.total,
  };
}

export function SET_TYPE(state, data) {
  state.types = data;
}

export function DELETE_ACTIVITY_LOG(state, id) {
  const activity_logs = state.activity_logs.filter((v) => v.id != id);
  state.activity_logs = activity_logs;
}
