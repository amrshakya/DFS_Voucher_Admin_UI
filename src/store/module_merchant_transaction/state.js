export default function () {
  return {
    merchants_transaction: [],
    pagination: {
      page: 1,
      rowsPerPage: 50,
    },
    status: [
      { label: "Not Claimed", value: 0 },
      { label: "Claimed", value: 1 },
      { label: "Expired", value: 2 },
      { label: "Manual Claim", value: 3 }
    ],
    route: {
      list: {
        action: "MERCHANT_TRANSACTION/INDEX",
        path: "/merchant/transaction"
      },
      export: {
        action: "MERCHANT_TRANSACTION/EXPORT",
        path: "/merchant/transaction"
      },
      update_status: {
        action: "MERCHANT_TRANSACTION/UPDATE_STATUS",
        path: "/merchant/transaction/status/:merchant_id",
        permission: "admin.merchant.transaction.status.edit"
      }
    },
  };
}
