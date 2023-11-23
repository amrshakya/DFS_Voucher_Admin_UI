<template>
  <div>
    <div class="row q-pa-md q-col-gutter-sm justify-end">
      <div class="col-12 text-right">
        <q-btn
          v-if="route?.list"
          color="secondary"
          icon-right="search"
          label="Search"
          no-caps
          class="q-ml-sm"
          @click="searchData()"
        />
        <q-btn
          v-if="route?.create"
          v-show="$can('read', route?.create.permission)"
          class="q-ml-sm"
          color="red"
          icon-right="add"
          label="Add"
          no-caps
          @click="createData()"
        />
        <q-btn
          v-if="route?.export"
          class="q-ml-sm"
          color="primary"
          icon-right="archive"
          label="Export"
          no-caps
          @click="exportData()"
        />
      </div>
    </div>

    <q-card class="q-mt-md">
      <q-card-section class="q-pa-none">
        <q-table
          ref="appTable"
          :dense="$q.screen.lt.md"
          :rows="rows"
          :columns="columns"
          :row-key="'id'"
          v-model:pagination="pagination"
          :no-data-label="'No Record Found'"
          :rows-per-page-options="[2, 10, 50, 100, 200]"
          @request="onRequestEvent"
        >
          <template v-slot:no-data="{ message }">
            <div class="full-width row flex-center text-accent q-gutter-sm">
              <span class="text-weight-bold"> {{ message }}</span>
            </div>
          </template>

          <!-- <template v-slot:body-cell-currency="props">
            <td :props="props" class="actions q-gutter-x-sm">
              <q-chip
                :clickable="false"
                dense
                class="text-weight-medium text-body2 text-white"
                size="md"
                square
                color="teal"
              >
                {{ props.value }}
              </q-chip>
            </td>
          </template> -->

          <template v-slot:body-cell-status="props">
            <td :props="props" class="actions q-gutter-x-sm">
              <q-chip
                :clickable="false"
                dense
                class="text-weight-medium text-body2 text-white"
                size="md"
                square
                :color="props.value === 0 ? 'grey' : props.value === 1 ? 'positive' : 'red'"
              >
                {{ props.value === 0 ? 'Inactive' : props.value === 1 ? 'Active' : 'Freeze' }}
              </q-chip>
            </td>
          </template>

          <template v-slot:body-cell-actions="props">
            <td :props="props" class="actions q-gutter-x-sm">
              <slot name="body-cell-actions-prepend" v-bind="props" />

              <q-btn
                v-if="useDefaultAction && route?.edit"
                v-show="$can('read', route?.edit.permission)"
                icon="edit"
                size="md"
                color="secondary"
                flat
                dense
                :disabled="canRowBeEdit(props.row)"
                @click="editData(props.row)"
              >
                <q-tooltip> Edit Record </q-tooltip></q-btn
              >
              <q-btn
                v-if="useDefaultAction && route?.destroy && !hideDeleteAction"
                v-show="$can('read', route?.destroy.permission)"
                icon="delete"
                size="md"
                color="negative"
                flat
                dense
                :disabled="!canRowBeDelete(props.row)"
                @click="deleteData(props.row)"
              >
                <q-tooltip> Delete Record </q-tooltip></q-btn
              >
            </td>
          </template>

          <template v-for="slot in Object.keys($slots)" v-slot:[slot]="props">
            <slot :name="slot" v-bind="props" />
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import {
  defineComponent,
  unref,
  ref,
  computed,
  onMounted,
  defineExpose,
} from "vue";
import { useStore } from "vuex";
import { useQuasar, exportFile } from "quasar";
import _ from "lodash";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  name: "AppTableV2",
  props: {
    route: {
      type: Object,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    storeListGettersPath: {
      type: String,
      required: true,
    },
    storePaginationGettersPath: {
      type: String,
      required: true,
    },
    searchFilter: {
      type: Object,
      reqquired: false,
    },
    exportFileName: {
      type: String,
    },
    canRowBeEdit: {
      type: Function,
      default: function (row) {
        return false;
      },
    },
    canRowBeDelete: {
      type: Function,
      default: function (row) {
        return true;
      },
    },
    routeKey: {
      type: String,
      required: true,
    },
    sortBy: {
      type: String,
      required: false,
      default: "id",
    },
    useDefaultAction: {
      type: Boolean,
      required: false,
      default: true,
    },
    hideDeleteAction: {
      type: Boolean,
      default: false,
    },
    skipLoadingOnMount: {
      type: Boolean,
      default: false,
    },
    saveRouteHistory: {
      type: Boolean,
      default: false,
    },
    storeRouteHistoryPath: {
      type: String,
      required: false,
      default: "",
    },
    rowsPerPage: {
      type: Number,
      default: 50,
    }
  },
  setup(props) {
    const $q = useQuasar();
    const $store = useStore();
    const $route = useRoute();
    const $router = useRouter();
    const rows = computed(() => $store.getters[props.storeListGettersPath]);
    const pagination = computed(
      () => $store.getters[props.storePaginationGettersPath]
    );

    function searchData() {
      let paginationFilter = {
        rowsPerPage:
          pagination.value != undefined
            ? pagination.value.rowsPerPage
            : undefined,
        page: 1,
      };

      loadData(paginationFilter);
    }

    async function loadData(paginationFilter) {
      var searchCriteria = { ...props.searchFilter };
      delete searchCriteria["page"];
      delete searchCriteria["rowsPerPage"];

      $q.loading.show();
      await $store.dispatch(props.route.list.action, {
        page:
          paginationFilter != undefined
            ? paginationFilter.page
            : props.searchFilter.page != null
            ? props.searchFilter.page
            : pagination.value != undefined
            ? pagination.value.page
            : null,
        size:
          paginationFilter != undefined
            ? paginationFilter.rowsPerPage
            : props.searchFilter.rowsPerPage != null
            ? props.searchFilter.rowsPerPage
            : pagination.value != undefined
            ? pagination.value.rowsPerPage
            : undefined,
        ..._.transform(searchCriteria, (r, v, k) => { r[`${k}`] = _.isString(v) ? v.trim() : v }),
      });

      updateRoute();
      $q.loading.hide();
    }

    async function loadDataWithCustomSearchCriteria(data) {
      var searchCriteria = { ...data };
      delete searchCriteria["page"];
      delete searchCriteria["rowsPerPage"];
      $q.loading.show();
      await $store.dispatch(props.route.list.action, {
        page: data.page != undefined ? data.page : null,
        size: data.rowsPerPage != undefined ? data.rowsPerPage : undefined,
        ..._.transform(searchCriteria, (r, v, k) => { r[`${k}`] = _.isString(v) ? v.trim() : v }),
      });

      updateRoute();
      $q.loading.hide();
    }

    async function exportData() {
      $q.loading.show();
      var exportFilter = props.searchFilter;
      exportFilter["page"] = null;
      exportFilter["rowsPerPage"] = null;
      const response = await $store.dispatch(props.route.export.action, {
        ..._.transform(exportFilter, (r,v,k) => {r[`${k}`] = _.isString(v) ? v.trim() : v}),
      });
      $q.loading.hide();
      return exportFile(this.exportFileName, response, 'text/csv');
    }

    async function deleteData(row) {
      if (props.onDelete) {
        return props.onDelete();
      }
      $q.dialog({
        title: "Confirm",
        message: "Are you sure to remove this item ?",
        cancel: true,
        persistent: true,
      }).onOk(async function () {
        $q.loading.show();
        const response = await $store.dispatch(
          props.route.destroy.action,
          row[props.routeKey]
        );
        loadData();
        $q.loading.hide();
      });
    }

    function editData(row) {
      if (props.onEdit) {
        return props.onEdit();
      }
      let route = props.route.edit.path.split("/");
      route.splice(-1, 1, "edit", row[props.routeKey]);
      route = route.join("/");
      $router.push(route);
    }

    function createData() {
      if (props.onCreate) {
        return props.onCreate();
      }
      $router.push(props.route.create.path + "/create");
    }

    function onRequestEvent(event) {
      event = unref(event);
      let paginationFilter = {
        rowsPerPage: event.pagination.rowsPerPage,
        page: event.pagination.page,
      };

      loadData(paginationFilter);
    }

    function updateRoute() {
      $router.replace({
        name: $route.name,
        query: {
          ...Object.fromEntries(
            Object.entries(props.searchFilter).filter(
              ([_, v]) => v != null && v !== ""
            )
          ),
          page: pagination.value.page,
          rowsPerPage: pagination.value.rowsPerPage,
        },
      });

      if (props.saveRouteHistory && props.storeRouteHistoryPath != "") {
        $store.dispatch(props.storeRouteHistoryPath, {
          ...Object.fromEntries(
            Object.entries(props.searchFilter).filter(
              ([_, v]) => v != null && v !== ""
            )
          ),
          page: pagination.value.page,
          rowsPerPage: pagination.value.rowsPerPage,
        });
      }
    }

    onMounted(function () {
      if (!props.skipLoadingOnMount) {
        loadData();
      }
    });

    return {
      loadDataWithCustomSearchCriteria,
      rows,
      pagination,
      loadData,
      exportData,
      searchData,
      deleteData,
      createData,
      editData,
      onRequestEvent,
    };
  },
});
</script>
