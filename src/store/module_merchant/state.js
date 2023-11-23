export default function () {
  return {
    merchants: [],
    pagination: {
      page: 1,
      rowsPerPage: 50,
    },
    currency: [
      { label: 'BDT', value: 'BDT' },
      { label: 'PHP', value: 'PHP' },
      { label: 'USDT', value: 'USD' },
    ],
    route: {
      list: {
        action: "MERCHANT/INDEX",
        path: "/merchant"
      },
      create: {
        action: "MERCHANT/CREATE",
        path: "/merchant",
        permission: "admin.merchant.store"
      },
      update_status: {
        action: "MERCHANT/UPDATE_STATUS",
        path: "/merchant/status/:merchant_id",
        permission: "admin.merchant.status.edit"
      },
      revoke_keys: {
        action: "MERCHANT/REVOKE_KEYS",
        path: "/merchant/revoke/:merchant_id",
        permission: "admin.merchant.revoke.edit"
      }
    },
  };
}
