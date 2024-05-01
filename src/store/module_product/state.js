export default function () {
  return {
    products: [],
    pagination: {
      page: 1,
      rowsPerPage: 50,
    },
    isSales: [
      { label: 'NO', value: 0 },
      { label: 'YES', value: 1 }
    ],
    status: [
      { label: 'Inactive', value: 0 },
      { label: 'Active', value: 1 }
    ],
    discountType: [
      { label: 'No Discount', value: 0 },
      { label: 'Fixed Price', value: 1 },
      { label: 'Percentage', value: 2 }
    ],
    productType: [
      { label: "FREE_CREDIT", value: 1 },
      { label: "REWARD_POINT", value: 2 },
      { label: "GIFT_CARD", value: 3 }
    ],
    expiryType: [
      { label: "Days", value: 'day' },
      { label: "Hours", value: 'hour'}
    ],
    route: {
      list: {
        action: "PRODUCT/INDEX",
        path: "/product",
      },
      create: {
        action: "PRODUCT/CREATE",
        path: "/product",
        permission: "admin.product.store",
      },
      edit: {
        action: "PRODUCT/EDIT",
        path: "/product/:id",
        permission: "admin.product.edit",
      },
      list_image: {
        action: "PRODUCT/GET_IMAGE",
        path: "/product/image",
        permission: "admin.product.image.index"
      },
      edit_image: {
        action: "PRODUCT/EDIT_IMAGE",
        path: "/product/image/:product_id",
        permission: "admin.product.image.edit"
      },
      remove_image: {
        action: "PRODUCT/REMOVE_IMAGE",
        path: "/product/image/:image_id",
        permission: "admin.product.image.destroy"
      }
    },
  };
}
