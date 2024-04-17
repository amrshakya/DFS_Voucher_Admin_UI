export function SET_CATEGORY(state, response) {
  state.categorys = response.data.records;
  if (response.data.meta != undefined)
    state.pagination = {
      page: response.data.meta.current_page,
      rowsPerPage: response.data.meta.per_page,
      rowsNumber: response.data.meta.total,
    };
}

export function ADD_CATEGORY(state, data) {
  let categorys = state.categorys.concat(data);
  state.categorys = categorys;
}

export function EDIT_CATEGORY(state, data) {
  let index = state.categorys.findIndex((p) => p.Id == data.Id);
  if (index != -1) {
    state.categorys[index] = data;
  }
}

export function SET_CATEGORY_PRODUCT(state, response) {
  state.products = response.data.excluded;
  state.assigned_products = response.data.assigned;
}
