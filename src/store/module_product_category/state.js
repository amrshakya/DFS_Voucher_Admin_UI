export default function () {
  return {
    categorys: [],
    pagination: {
      page: 1,
      rowsPerPage: 50,
    },
    route: {
      list: {
        action: "PRODUCT_CATEGORY/INDEX",
        path: "/product/category",
      },
      create: {
        action: "PRODUCT_CATEGORY/CREATE",
        path: "/product/category",
        permission: "admin.product.category.store",
      },
      edit: {
        action: "PRODUCT_CATEGORY/EDIT",
        path: "/product/category/:id",
        permission: "admin.product.category.edit",
      },
      assign: {
        action: "PRODUCT_CATEGORY/ASSIGN",
        path: "/product/category/assign/:id",
        permission: "admin.product.category.assign.edit",
      },
    },
  };
}
