<template>
  <q-page class="q-pa-md">
     <!-- Update Status -->
      <q-dialog
        v-model="update_status.dialog"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card>
          <q-card-section>
            <div class="text-h6">Update Status - {{ current_row.Username }}</div>
          </q-card-section>
          <q-card-section>
            <q-form :ref="(el) => (update_status.form$ = el)">
              <q-select
                v-model="update_status.status"
                label="Status"
                :options="[
                  { label: 'Inactive', value: 0 },
                  { label: 'Active', value: 1 },
                  { label: 'Freeze', value: 2 },
                ]"
                emit-value
                map-options
                filled
                :rules="[
                  $rules.required('Value is required')
                ]"
              />
            </q-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="OK" @click="submit_update_status(current_row)" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    <q-card>
      <q-card-section class="q-pa-none">
        <div class="row q-pa-md q-col-gutter-sm justify-end">
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
              :options="[
                { label: 'Inactive', value: 0 },
                { label: 'Active', value: 1 },
                { label: 'Freeze', value: 2 },
              ]"
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
        >
        <template v-slot:body-cell-merchantRedeemUrl="props">
          <q-chip
            dense
            class="text-weight-medium text-body2 text-white"
            size="md"
            square
            :color="props.value ? 'positive' : 'red'"
          >
            {{ props.value ? props.value : "N/A" }}
          </q-chip>
        </template>
        <template v-slot:body-cell-actions-prepend="props">
          <q-btn
            v-show="$can('read', route.update_status.permission)"
            icon="visibility"
            size="md"
            class="q-ml-sm"
            color="secondary"
            flat
            dense
            @click="open_update_status(props.row)">
            <q-tooltip> Update Status </q-tooltip>
          </q-btn>
          <q-btn
            v-show="$can('read', route.revoke_keys.permission)"
            icon="vpn_key"
            size="md"
            color="secondary"
            flat
            dense
            @click="revoke_keys(props.row)"
          >
            <q-tooltip> Revoke Keys </q-tooltip>
          </q-btn>
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

export default defineComponent({
  components: {
    AppTableV2,
    SearchFilter,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();

    const route = computed(() => $store.getters["MERCHANT/GET_ROUTE"]);
    const $route = useRoute();
    const searchFilter = ref({ ...$route.query });

    const $q = useQuasar();
    const current_row = ref(null);
    const update_status = ref({
      dialog: false,
      status: null,
      form$: null
    })

    const columns = ref([
      {
        name: "merchantName",
        label: "Merchant Name",
        field: (row) => row.MerchantName,
        align: "left"
      },
      {
        name: "currency",
        label: "Currency",
        field: (row) => get_currency_label(row),
        align: "left"
      },
      {
        name: "merchantRedeemUrl",
        label: "Merchant Redeem Url",
        field: (row) => row.MerchantRedeemUrl,
        align: "left"
      },
      {
        name: "status",
        label: "Status",
        field: (row) => row.Status,
        align: "left"
      },
      {
        name: "addTime",
        label: "RegisterTime",
        field: (row) => row.AddTime,
        align: 'left'
      },
      {
        name: "actions",
        label: "Actions",
        field: "actions",
        align: "left"
      },
    ]);

    function get_currency_label (row) {
      return row.Currency ? row.Currency.map(r => `${r.Currency}-${r.Country}`).join(',') : '';
    }

    async function revoke_keys (row) {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure to regenerate API key of the selected merchant?",
        cancel: true,
      }).onOk(async function () {
        $q.loading.show();
        await $store.dispatch(route.value.revoke_keys.action, {
          id: row.Id
        });
        $q.loading.hide();
      });
    }

    function open_update_status(row) {
      current_row.value = row;
      update_status.value.dialog = true;
      update_status.value.status = row.Status
    }

    async function submit_update_status (row) {
      const valid = await update_status.value.form$.validate();
      if (!valid) return;
      $q.dialog({
        title: "Confirm",
        message: "Are you sure to update status?",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        $q.loading.show();
        const response = await $store.dispatch(route.value.update_status.action, {
          id: current_row.value.Id,
          form: {
            status: update_status.value.status
          }
        });
        $q.loading.hide();

        update_status.value.dialog = false;
        update_status.value.status = null;
      });
    }

    return {
      revoke_keys,
      update_status,
      open_update_status,
      submit_update_status,
      current_row,
      searchFilter,
      columns,
      storeListGettersPath: "MERCHANT/GET_MERCHANTS",
      storePaginationGettersPath: "MERCHANT/GET_MERCHANTS_PAGINATION",
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
