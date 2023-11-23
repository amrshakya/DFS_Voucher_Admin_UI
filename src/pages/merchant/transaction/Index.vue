<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="q-pa-none">
        <div class="row q-pa-md q-col-gutter-sm justify-end">
          <div class="col-3">
            <search-filter
              v-model="searchFilter.orderNumber"
              label="Order Number"
              placeholder="Order Number"
            ></search-filter>
          </div>
          <div class="col-3">
            <search-filter
              v-model="searchFilter.username"
              label="Username"
              placeholder="Username"
            ></search-filter>
          </div>
          <div class="col-3">
            <search-filter
              v-model="searchFilter.voucherCode"
              label="Voucher Code"
              placeholder="Voucher Code"
            ></search-filter>
          </div>
          <div class="col-3">
            <search-filter
              v-model="searchFilter.productName"
              label="Voucher Name"
              placeholder="Voucher Name"
            ></search-filter>
          </div>
          <div class="col-3">
            <search-filter
              v-model="searchFilter.sku"
              label="Voucher SKU"
              placeholder="Voucher SKU"
            ></search-filter>
          </div>
          <div class="col-3">
            <search-filter
              v-model="searchFilter.currency"
              label="Currency"
              placeholder="Currency"
            ></search-filter>
          </div>
          <div class="col-3">
            <search-filter
              v-model="searchFilter.name"
              label="Name"
              placeholder="Name"
            ></search-filter>
          </div>
          <div class="col-3">
            <q-select
              v-model="searchFilter.status"
              standout
              square
              outlined
              :options="status"
              label="Status"
              emit-value
              map-options
              clearable
            />
          </div>
        </div>

        <app-table-v2
          ref="appTable"
          :routeKey="'Id'"
          :route="route"
          :columns="columns"
          :storePaginationGettersPath="storePaginationGettersPath"
          :storeListGettersPath="storeListGettersPath"
          :searchFilter="searchFilter"
          :exportFileName="exportFileName"
        >
        <template v-slot:body="props">
          <tr :props="props">
            <td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name == 'paidAmount'">
                <q-badge
                  class="q-my-sm justify-center text-subtitle2 text-amount"
                  color="primary"
                  :label="`${formatHandler.formatNumber(props.row.PaidAmount)}`"
                  rounded
                />
              </template>
              <template v-else-if="col.name == 'transactionStatus'">
                <q-chip
                  :clickable="false"
                  dense
                  class="text-weight-medium text-body2 text-white"
                  size="md"
                  square
                  :color="[
                      'info',
                      'positive',
                      'negative',
                      'amber'
                    ][col.value]
                    "
                >
                  {{
                    status.find((v) => v.value == col.value)?.label || "--"
                  }}
                </q-chip>
              </template>
              <template v-else>
                {{ col.value }}
              </template>
              <template v-if="col.name == 'actions'">
                <q-btn
                  v-show="$can('read', route.update_status.permission) && props.row.Status === 0"
                  icon="check_circle"
                  size="md"
                  class="q-ml-sm"
                  color="secondary"
                  flat
                  dense
                  @click="manual_claim_status(props.row)">
                  <q-tooltip> Update Status </q-tooltip>
                </q-btn>
              </template>
            </td>
          </tr>
        </template>
        </app-table-v2>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import AppTableV2 from "components/AppTableV2.vue";
import SearchFilter from "components/SearchFilter.vue";
import { useRouter, useRoute } from "vue-router";
import { formatHandler } from "src/utils";
export default defineComponent({
  components: {
    AppTableV2,
    SearchFilter,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();

    const route = computed(() => $store.getters["MERCHANT_TRANSACTION/GET_ROUTE"]);
    const $route = useRoute();
    const searchFilter = ref({ ...$route.query });
    const status = computed(() => $store.getters["MERCHANT_TRANSACTION/GET_STATUS"]);
    const exportFileName = `Merchant Transaction - ${new Date().toDateString()}.csv`;

    const $q = useQuasar();
    const current_row = ref(null);

    const columns = ref([
      {
        name: "merchantName",
        label: "Merchant Name",
        field: (row) => row.MerchantName,
        align: "left"
      },
      {
        name: "orderNumber",
        label: "Order Number",
        field: (row) => row.OrderNumber,
        align: "left"
      },
      {
        name: "username",
        label: "Username",
        field: (row) => row.Username,
        align: "left"
      },
      {
        name: "productName",
        label: "Voucher",
        field: (row) => row.ProductName,
        align: "left"
      },
      {
        name: "sku",
        label: "SKU",
        field: (row) => row.SKU,
        align: "left"
      },
      {
        name: "voucherCode",
        label: "Voucher Code",
        field: (row) => row.VoucherCode,
        align: "left"
      },
      {
        name: "currency",
        label: "Currency",
        field: (row) => row.Currency,
        align: "left"
      },
      {
        name: "paidAmount",
        label: "Diamond",
        field: (row) => row.PaidAmount,
        align: "left"
      },
      {
        name: "transactionStatus",
        label: "Status",
        field: (row) => row.Status,
        align: "left"
      },
      {
        name: "addTime",
        label: "Purchase On",
        field: (row) => row.AddTime,
        align: 'left'
      },
      {
        name: "expiryTime",
        label: "Expiry Time",
        field: (row) => row.ExpiryTime,
        align: 'left'
      },
      {
        name: "actions",
        label: "Actions",
        field: "actions",
        align: "left"
      },
    ]);

    async function manual_claim_status (row) {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure to mark the status to claimed?",
        cancel: true,
      }).onOk(async function () {
        $q.loading.show();
        await $store.dispatch(route.value.update_status.action, {
          id: row.Id
        });
        $q.loading.hide();
      });
    }

    return {
      manual_claim_status,
      formatHandler,
      current_row,
      searchFilter,
      columns,
      status,
      storeListGettersPath: "MERCHANT_TRANSACTION/GET_MERCHANTS_TRANSACTION",
      storePaginationGettersPath: "MERCHANT_TRANSACTION/GET_MERCHANTS_TRANSACTION_PAGINATION",
      route,
      $router,
    };
  },
});
</script>
<style lang="scss" scoped>
.q-dialog .q-card {
  width: 60vw;
  .q-btn.bg-teal {
    padding: 0 24px;
  }
}
.q-table__container:deep() .q-table tbody .q-td.actions {
  text-align: right !important;
}
</style>
