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
              label="Category Name"
              placeholder="Category Name"
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
          :ref="(el) => (table = el)"
          :routeKey="'Id'"
          :route="route"
          :columns="columns"
          :storePaginationGettersPath="storePaginationGettersPath"
          :storeListGettersPath="storeListGettersPath"
          :searchFilter="searchFilter"
        >
        <template v-slot:body="props">
          <tr :props="props">
            <td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name == 'name'">
                {{ props.row.Name }}
                <q-chip v-show="props.row.IsFlash" dense color="orange" text-color="white">
                  Is Flash
                </q-chip>
              </template>
              <template v-else-if="col.name == 'duration'">
                <span v-if="props.row.IsFlash">
                  <span>From: {{ formatDate(props.row.StartTime) }}</span><br/>
                  <span>To: {{ formatDate(props.row.EndTime) }}</span>
                </span>
                <span v-else>-</span>
              </template>
              <template v-else-if="col.name == 'status'">
                  <q-chip
                  :clickable="false"
                  dense
                  class="text-weight-medium text-body2 text-white"
                  size="md"
                  square
                  :color="[
                    'negative',
                    'positive',
                  ][col.value]
                    "
                >
                  {{ col.value === 0 ? 'Inactive' : 'Active' }}
                </q-chip>
              </template>
              <template v-else-if="col.name == 'actions'">
                <q-btn
                  v-if="route.edit"
                  v-show="$can('read', route.edit.permission)"
                  icon="edit"
                  size="md"
                  color="secondary"
                  flat
                  dense
                  @click="table.editData(props.row)"
                />
              </template>
              <template v-else>{{ col.value }}</template>
            </td>
          </tr>
        </template>
        <!-- <template v-slot:body-cell-actions-prepend="props">
          <q-btn
            v-show="$can('read', route.assign.permission)"
            icon="assignment"
            size="md"
            class="q-ml-sm"
            color="secondary"
            flat
            dense
            @click="open_assign_product(props.row)"
          >
            <q-tooltip> Add Products </q-tooltip>
          </q-btn>
        </template> -->
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
import moment from 'moment-timezone';

export default defineComponent({
  components: {
    AppTableV2,
    SearchFilter,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();

    const route = computed(() => $store.getters["PRODUCT_CATEGORY/GET_ROUTE"]);
    const $route = useRoute();
    const searchFilter = ref({ ...$route.query });

    const $q = useQuasar();
    const current_row = ref(null);
    const update_status = ref({
      dialog: false,
      status: null,
      form$: null
    })

    // const assign_product = ref({
    //   dialog: false,
    //   product: null,
    //   form$: null
    // })

    const formatDate = (date) => {
      return moment(date).format("YYYY-MM-DD");
    }

    const columns = ref([
      {
        name: "name",
        label: "Category Name",
        field: (row) => row.Name,
        align: "left"
      },
      {
        name: "duration",
        label: "Flash Duration",
        field: (row) => row.StartTime,
        align: "left"
      },
      {
        name: "description",
        label: "Description",
        field: (row) => row.Description,
        align: "left"
      },
      {
        name: "status",
        label: "Status",
        field: (row) => row.Status,
        align: "left"
      },
      {
        name: "actions",
        label: "Actions",
        field: "actions",
        align: "left"
      },
    ]);

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
      formatDate,
      update_status,
      open_update_status,
      submit_update_status,
      current_row,
      searchFilter,
      columns,
      storeListGettersPath: "PRODUCT_CATEGORY/GET_CATEGORY",
      storePaginationGettersPath: "PRODUCT_CATEGORY/GET_CATEGORY_PAGINATION",
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
