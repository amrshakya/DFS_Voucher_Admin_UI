export function SET_MERCHANTS_TRANSACTION(state, response) {
  state.merchants_transaction = response.data.records;
  if (response.data.meta != undefined)
    state.pagination = {
      page: response.data.meta.current_page,
      rowsPerPage: response.data.meta.per_page,
      rowsNumber: response.data.meta.total,
    };
}

export function EDIT_MERCHANTS_TRANSACTION(state, data) {
  let index = state.merchants_transaction.findIndex((p) => p.Id == data.Id);
  if (index != -1) {
    state.merchants_transaction[index] = data;
  }
}
