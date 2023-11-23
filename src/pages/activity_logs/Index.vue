<template>
  <q-page class="q-pa-md">
    <!-- View Activity Detail Dialog -->
    <q-dialog
      v-model="view_dialog"
      transition-show="scale"
      transition-hide="scale"
      class="view-dialog"
    >
      <q-card>
        <q-card-section>
          <span class="text-subtitle1">Activity Log</span>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="causer-wrapper">
            <span>Admin</span>
            <span
              >: {{ current_row.causer.name }} ({{
                current_row.causer.username
              }})
            </span>
          </div>
          <div class="causer-wrapper">
            <span>Type</span>
            <span>: {{ current_row.description }}</span>
          </div>
          <div class="causer-wrapper">
            <span>URL</span>
            <span>: {{ current_row.properties.request.url }}</span>
          </div>
          <div class="causer-wrapper">
            <span>IP address</span>
            <span>: {{ current_row.properties.request.ip ?? "-" }}</span>
          </div>
          <div class="causer-wrapper">
            <span>Date</span>
            <span>: {{ current_row.created_at }}</span>
          </div>
        </q-card-section>
        <q-card-section class="property-wrapper">
          <table>
            <thead>
              <tr>
                <th>Field Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="!isEmpty(current_row.properties.request.data)">
                <tr
                  v-for="(value, name) in current_row.properties.request.data"
                  :key="name"
                >
                  <td>{{ name }}</td>
                  <td>
                    <pre v-if="typeof value === 'object'">{{ value }}</pre>
                    <template v-else>{{ value }}</template>
                  </td>
                </tr>
              </template>
              <tr v-else>
                <td colspan="2" class="empty">Empty value.</td>
              </tr>
            </tbody>
          </table>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-card>
      <q-card-section class="q-pa-none q-mb-sm">
        <div class="row q-pa-md q-col-gutter-sm justify-end">
          <div class="col-3">
            <search-filter
              v-model="searchFilter.description"
              label="Action"
              :options="
                types.map((x) => {
                  return { label: x, value: `${x}` };
                })
              "
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
            <search-filter
              v-model="searchFilter.causer_id"
              label="Admin"
              :options="
                admins.map((x) => {
                  return { label: x.name, value: `${x.id}` };
                })
              "
            ></search-filter>
          </div>
          <div class="col-3">
            <form-date-time-picker
              v-model="searchFilter.created_at_between"
              label="Date"
              range
            />
          </div>
        </div>

        <app-table-v2
          ref="appTable"
          :routeKey="'id'"
          :route="route"
          :columns="columns"
          :storePaginationGettersPath="storePaginationGettersPath"
          :storeListGettersPath="storeListGettersPath"
          :searchFilter="searchFilter"
        >
          <template v-slot:body-cell-causer="props">
            <td :props="props">
              <span class="text-weight-bold">{{ props.value.name }}</span
              ><br />
              <span>{{ props.value.username }}</span>
            </td>
          </template>
          <template v-slot:body-cell-actions-prepend="props">
            <q-btn
              icon="visibility"
              size="md"
              class="q-ml-sm"
              flat
              dense
              @click="viewDetail(props.row)"
            />
          </template>
        </app-table-v2>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { isEmpty } from "lodash";
import AppTableV2 from "components/AppTableV2.vue";
import FormDateTimePicker from "components/FormDateTimePicker.vue";
import moment from "moment-timezone";
import SearchFilter from "components/SearchFilter.vue";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  components: {
    AppTableV2,
    FormDateTimePicker,
    SearchFilter,
  },
  setup() {
    const $route = useRoute();
    const searchFilter = ref({ ...$route.query });
    const $store = useStore();
    const me = computed(() => $store.getters["AUTH/GET_ME"]);
    const route = computed(() => $store.getters["ACTIVITY_LOG/GET_ROUTE"]);
    const current_row = ref(null);
    const view_dialog = ref(false);

    const columns = ref([
      {
        name: "created_at",
        label: "Date",
        field: (row) =>
          `${row.created_at} - ${moment(row.created_at).fromNow()}`,
        align: "left",
        sortable: false,
      },
      {
        name: "description",
        label: "Action",
        field: (row) => row.description,
        align: "left",
        sortable: false,
      },
      {
        name: "name",
        label: "Name",
        field: (row) => row.data_name || '-',
        align: "left",
        sortable: false,
      },
      {
        name: "causer",
        label: "Admin",
        field: (row) => row.causer,
        align: "left",
        sortable: false,
      },
      {
        name: "actions",
        label: "",
        field: "actions",
        align: "left",
        sortable: false,
      },
    ]);

    function onDelete(row) {
      var appTable = this.$refs.appTable;
      appTable.deleteData(row["id"]);
    }

    function viewDetail(row) {
      view_dialog.value = true;
      current_row.value = row;
    }

    onMounted(function () {
      moment.tz.setDefault(me.value.timezone);
      Promise.all([
        $store.dispatch("ADMIN/INDEX", { per_page: 0 }),
        $store.dispatch(route.value.type.action),
      ]);
    });

    return {
      route,
      columns,
      searchFilter,
      storeListGettersPath: "ACTIVITY_LOG/GET_ACTIVITY_LOGS",
      storePaginationGettersPath: "ACTIVITY_LOG/GET_ACTIVITY_LOGS_PAGINATION",
      view_dialog,
      current_row,
      isEmpty,
      types: computed(() => $store.getters["ACTIVITY_LOG/GET_TYPES"]),
      admins: computed(() => $store.getters["ADMIN/GET_ADMINS"]),
      viewDetail,
      onDelete,
    };
  },
});
</script>
<style lang="scss" scoped>
.view-dialog .q-card {
  min-height: 50vh;
  min-width: 50vw;
  padding: 10px 10px 30px;
  .causer-wrapper {
    display: flex;
    span {
      display: block;
      line-height: 30px;
      &:first-child {
        flex-basis: 150px;
        font-weight: 500;
      }
      &:last-child {
        flex-basis: calc(100% - 150px);
      }
    }
  }
  .property-wrapper {
    max-height: calc(100vh - 400px);
    overflow: auto;
    table {
      width: 100%;
      border-collapse: collapse;
      td,
      th {
        border: 1px solid #999;
        padding: 10px;
        text-align: left;
        &.empty {
          text-align: center;
          font-style: italic;
          padding: 30px 0;
        }
        &:first-child {
          width: 25%;
        }
        &:last-child {
          width: 75%;
        }
      }
      pre {
        white-space: pre-wrap;
      }
    }
  }
}
</style>
