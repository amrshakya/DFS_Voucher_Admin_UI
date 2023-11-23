<template>
  <q-table
    :dense="$q.screen.lt.md"
    :rows="rows"
    :columns="columns"
    :row-key="rowKey"
    :filter="filter"
    :filter-method="onFilterEvent"
    :selection="selection"
    v-model:selected="selected"
    v-model:pagination="pagination"
    :loading="loading"
    :rows-per-page-options="[2, 50, 100, 200]"
    @request="onRequestEvent"
    binary-state-sort
    :style="style"
    :grid="grid"
    :headerStyle="headerStyle"
    :pagination-label="getPaginationLabel"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>

    <template v-slot:no-data="{ message }">
      <div
        v-if="!loading"
        class="full-width row flex-center text-accent q-gutter-sm"
      >
        <q-icon size="2em" name="sentiment_dissatisfied" />
        <span>Well this is sad... {{ message }}</span>
      </div>
    </template>

    <template v-slot:top-right="props" v-if="showFilter">
      <div class="flex q-gutter-sm q-my-sm">
        <slot name="filter" :filter="filter">
          <search-filter v-model="filter.name" />
        </slot>
        <slot name="top-right-buttons" v-bind="props">
          <q-btn
            v-if="route?.create"
            v-show="$can('read', route?.create.permission)"
            color="secondary"
            icon-right="add"
            label="Add"
            no-caps
            @click="onCreateEvent()"
          />
          <q-btn
            v-if="route?.export"
            color="primary"
            icon-right="archive"
            label="Export"
            no-caps
            @click="onExportEvent()"
          />
        </slot>
      </div>
    </template>

    <template v-slot:body-cell-actions="props">
      <q-td :props="props" class="actions q-gutter-x-sm">
        <slot name="body-cell-actions-prepend" v-bind="props" />
        <q-btn
          v-if="route?.edit"
          v-show="$can('read', route?.edit.permission)"
          icon="edit"
          size="md"
          color="secondary"
          flat
          dense
          :disabled="canEditBtn(props.row)"
          @click="onEditEvent(props.row)"
        />
        <q-btn
          v-if="route?.destroy"
          v-show="$can('read', route?.destroy.permission)"
          icon="delete"
          size="md"
          color="negative"
          flat
          dense
          :disabled="!canDelete(props.row)"
          @click="onDeleteEvent(props.row)"
        />
      </q-td>
    </template>

    <template v-slot:body-cell-status="props">
      <q-td :props="props">
        <q-badge
          rounded
          :color="props.value === 0 ? 'grey' : props.value === 1 ? 'positive' : 'red'"
          :label="props.value === 0 ? 'Inactive' : props.value === 1 ? 'Active' : 'Freeze'"
        />
      </q-td>
    </template>

    <template v-slot:item="props">
      <div
        class="q-pa-none q-my-sm col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''"
      >
        <q-card :class="props.selected ? 'bg-grey-2' : ''" class="q-py-md">
          <q-list dense class="justify-center">
            <q-item v-for="col in props.cols" :key="col.name" class="row">
              <div class="col-3">
                {{ col.label }}
              </div>
              <div class="col-9 text-center">
                <slot
                  v-if="col.name != 'actions'"
                  :name="`body-items-${col.name}`"
                  v-bind="props"
                >
                  {{ col.value }}
                </slot>
                <slot
                  v-else
                  name="body-items-actions"
                  :props="props"
                  class="actions"
                >
                  <slot name="body-items-actions-prepend" v-bind="props" />
                  <q-btn
                    v-if="route?.edit"
                    v-show="$can('read', route?.edit.permission)"
                    icon="edit"
                    size="md"
                    class="q-ml-sm"
                    color="secondary"
                    flat
                    dense
                    :disabled="canEditBtn(props.row)"
                    @click="onEditEvent(props.row)"
                  />
                  <q-btn
                    v-if="route?.destroy"
                    v-show="$can('read', route?.destroy.permission)"
                    icon="delete"
                    size="md"
                    class="q-ml-sm"
                    color="negative"
                    flat
                    dense
                    :disabled="!canDelete(props.row)"
                    @click="onDeleteEvent(props.row)"
                  />
                </slot>
              </div>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>

    <template v-for="slot in Object.keys($slots)" v-slot:[slot]="props">
      <slot :name="slot" v-bind="props" />
    </template>
  </q-table>
</template>

<script>
import { defineComponent, ref, unref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { useQuasar, exportFile } from "quasar";
import SearchFilter from "components/SearchFilter.vue";
import { mapKeys, l_filter, isEqual, omitBy, isNull } from "lodash";

export default defineComponent({
  components: { SearchFilter },
  name: "AppTable",
  props: {
    rows: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    rowKey: {
      type: String,
      required: true,
    },
    selection: {
      type: String,
      default: "none",
    },
    filename: {
      type: String,
      default: "export.csv",
    },
    route: {
      type: Object,
      required: true,
    },
    routeKey: {
      type: String,
      required: true,
    },
    serverSide: {
      type: Boolean,
      default: true,
    },
    filterMethod: {
      type: Function,
      default: null,
    },
    grid: {
      type: Boolean,
      default: false,
    },
    showFilter: {
      type: Boolean,
      default: true,
    },
    paginationLabel: {
      type: Function,
    },
    sortBy: {
      type: String,
      default: "id",
    },
    descending: {
      type: Boolean,
      default: true,
    },
    rowsPerPage: {
      type: Number,
      default: 2,
    },
    onRequest: {
      type: Function,
      default: null,
    },
    onCreate: {
      type: Function,
      default: null,
    },
    onEdit: {
      type: Function,
      default: null,
    },
    onDelete: {
      type: Function,
      default: null,
    },
    canEdit: {
      type: Function,
      default: function (row) {
        return false;
      },
    },
    canDelete: {
      type: Function,
      default: function (row) {
        return true;
      },
    },
    format: {
      type: Function,
      default: null,
    },
    style: {
      type: [String, Function],
      default: null,
    },
    headerStyle: {
      type: String,
      default: null,
    },
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();
    const $route = useRoute();
    const selected = ref([]);
    const loading = ref(false);
    const pagination = ref({
      page: 1,
      rowsPerPage: props.rowsPerPage,
    });
    if (props.serverSide) {
      pagination.value["rowsNumber"] = Number(props.rowsPerPage);
    }
    const filter = ref({ ...$route.query });
    watch(
      () => filter,
      (v) => {
        if (isEqual(v, filter.value)) return;
        $router.replace({
          name: $route.name,
          query: {
            ...Object.fromEntries(
              Object.entries(v.value).filter(([_, v]) => v != null && v !== "")
            ),
          },
        });
      },
      { deep: true }
    );
    watch(
      () => $route.query,
      async (v) => {
        if (isEqual(v, omitBy(filter.value, isNull))) return;
        filter.value = { ...v };
      }
    );

    watch(
      () => selected.value,
      (v) => {
        if (props.selection == "none") return;
        emit("selectedValue", v);
      }
    );

    const pagination_handler = function (event, response, pagination) {
      if (response.code != 200) {
        return;
      }
      if (response.meta) {
        pagination.value = {
          page: response.meta.pagination.current_page,
          rowsPerPage: event.pagination.rowsPerPage
            ? response.meta.pagination.per_page
            : "All",
          rowsNumber: response.meta.pagination.total,
        };
      } else {
        pagination.value = {
          page: 1,
          rowsPerPage: event.pagination.rowsPerPage
            ? response.data.length
            : "All",
          rowsNumber: response.data.length,
        };
      }
    };

    const onRequestEvent = async function (event) {
      event = unref(event);
      if (props.onRequest) {
        loading.value = true;
        const response = await props.onRequest(event);
        if (response?.code) {
          pagination_handler(event, response, pagination);
        }
        loading.value = false;
        return;
      }
      if (props.route?.index == null) {
        return;
      }
      if (!props.serverSide) {
        pagination.value = {
          page: event.pagination.current_page,
        };
        return;
      }
      loading.value = true;
      const response = await $store.dispatch(props.route.index.action, {
        page: event.pagination.page,
        size: event.pagination.rowsPerPage,
        ...mapKeys(event.filter, (v, k) => `${k}`),
      });
      pagination_handler(event, response, pagination);

      loading.value = false;
    };

    onMounted(async function () {
      if (props.serverSide) {
        onRequestEvent({
          pagination: unref(pagination),
          filter: unref(filter),
        });
      }
    });

    return {
      pagination,
      filter,
      selected,
      loading,
      onRequestEvent,
      getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
        if (props.paginationLabel) {
          return props.paginationLabel(
            firstRowIndex,
            endRowIndex,
            totalRowsNumber
          );
        }
        if (pagination.value.rowsPerPage === "All") {
          return `1-${totalRowsNumber} of ${totalRowsNumber}`;
        }
        return `${firstRowIndex}-${endRowIndex} of ${totalRowsNumber}`;
      },
      getSelectedString() {
        return selected.value.length === 0
          ? ""
          : `${selected.value.length} record${
              selected.value.length > 1 ? "s" : ""
            } selected of ${rows.value.length}`;
      },
      onFilterEvent(rows, terms, cols, getCellValue) {
        if (props.filterMethod) {
          return props.filterMethod(rows, filter.value);
        }
        if (props.showFilter) {
          Object.keys(filter.value).forEach((key) => {
            rows = l_filter(rows, function (o) {
              return o[key].includes(filter.value[key]);
            });
            return rows;
          });
        }
        return rows;
      },
      async onExportEvent() {
        $q.loading.show();
        const response = await $store.dispatch(props.route.export.action, {
          ...mapKeys(filter.value, (v, k) => `${k}`),
        });
        $q.loading.hide();
        return exportFile(props.filename, response);
      },
      onCreateEvent() {
        if (props.onCreate) {
          return props.onCreate();
        }
        $router.push(props.route.create.path + "/create");
      },
      onEditEvent(row) {
        if (props.onEdit) {
          return props.onEdit();
        }
        let route = props.route.edit.path.split("/");
        route.splice(-1, 1, "edit", row[props.routeKey]);
        route = route.join("/");
        $router.push(route);
      },
      async onDeleteEvent(row) {
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
          onRequestEvent({
            pagination: pagination.value,
            filter: filter.value,
          });
          $q.loading.hide();
        });
      },
      canEditBtn(row) {
        return props.canEdit(row);
      },
    };
  },
});
</script>

<style lang="scss" scoped></style>
