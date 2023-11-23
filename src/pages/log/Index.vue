<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="q-pa-none">
        <div class="log-table-wrapper">
          <app-table
            :rows="rows"
            :columns="columns"
            :route="route"
            :show-filter="false"
            :server-side="false"
            row-key="date"
            route-key="date"
          >
            <template v-slot:header-cell="props">
              <q-th :props="props">
                <q-badge
                  :color="level_info[props.col.name]['color']"
                  v-if="props.col.name !== 'actions'"
                  rounded
                >
                  <q-icon
                    v-if="props.col.name !== 'date'"
                    :name="level_info[props.col.name]['icon']"
                    color="white"
                  />
                  <span>{{ props.col.label }}</span>
                </q-badge>
                <span v-else>{{ props.col.label }}</span>
              </q-th>
            </template>
            <template v-slot:body-cell="props">
              <q-td :props="props">
                <q-badge
                  :color="`${
                    props.col.name === 'date'
                      ? 'blue'
                      : props.value > 0
                      ? level_info[props.col.name]['color']
                      : 'grey-5'
                  }`"
                  :label="props.value"
                />
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td>
                <q-btn
                  v-show="$can('read', route.show.permission)"
                  icon="search"
                  size="md"
                  class="q-ml-sm"
                  color="blue-grey"
                  flat
                  dense
                  @click="setRow(props.row)"
                />
                <q-btn
                  v-show="$can('read', route.destroy.permission)"
                  icon="delete"
                  size="md"
                  class="q-ml-sm"
                  color="negative"
                  flat
                  dense
                  @click="remove(props.row.date)"
                />
              </q-td>
            </template>
          </app-table>
        </div>
        <div v-if="current_row" class="log-detail-wrapper">
          <span class="title">Log[{{ current_row.date }}]</span>
          <q-separator />
          <div class="row q-col-gutter-sm q-ma-xs q-mb-sm">
            <!-- Log levels -->
            <div class="col-sm-3 col-xs-12">
              <q-list bordered padding separator class="rounded-borders">
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="flag" />
                  </q-item-section>
                  <q-item-section> Levels </q-item-section>
                </q-item>
                <q-item
                  v-for="(value, level) in current_log_level"
                  :key="level"
                  :active="filter.level === level"
                  active-class="bg-blue-9 text-white"
                  clickable
                  @click="filter.level = level"
                >
                  <q-item-section avatar>
                    <q-icon :name="level_info[level]['icon']" />
                  </q-item-section>
                  <q-item-section>
                    {{ level_info[level]["label"] }}
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label caption>
                      <q-badge
                        :color="
                          value > 0 ? level_info[level]['color'] : 'grey-5'
                        "
                        :label="value"
                      />
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <!-- Log content -->
            <div class="col-sm-9 col-xs-12">
              <template v-if="filter.date">
                <q-list
                  bordered
                  padding
                  separator
                  class="rounded-borders log-info-list"
                >
                  <q-item>
                    <q-item-section> Log info: </q-item-section>
                    <q-item-section side>
                      <q-btn
                        color="red"
                        icon="delete"
                        label="Delete"
                        @click="remove(filter.date)"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section class="info-list">
                      <div class="info-item">
                        <span>Log entries:</span>
                        <q-badge
                          color="blue"
                          :label="level_info[filter.level]['label']"
                        />
                      </div>
                      <div class="info-item">
                        <span>Created at:</span>
                        <q-badge color="blue" :label="filter.date" />
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-input
                        filled
                        borderless
                        dense
                        debounce="300"
                        v-model="filter.queryStr"
                        class="log-search-input"
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </q-item-section>
                  </q-item>
                </q-list>
                <q-card class="level-item-table">
                  <q-card-section class="q-pa-none">
                    <app-table
                      :rows="rows_log_items"
                      :columns="columns_log_items"
                      :row-key="'id'"
                      :grid="$q.screen.lt.sm"
                      :route="route"
                      :route-key="'id'"
                      :showFilter="false"
                      :filter="filter"
                      @request="onRequest"
                    >
                      <template v-slot:body-cell-channel="props">
                        <q-td :props="props">
                          <q-badge color="deep-purple" :label="props.value" />
                        </q-td>
                      </template>
                      <template v-slot:body-cell-level="props">
                        <q-td :props="props">
                          <q-badge
                            :color="level_info[props.value]['color']"
                            :label="props.value"
                          />
                        </q-td>
                      </template>
                      <template v-slot:body-cell-created_at="props">
                        <q-td :props="props">
                          <q-badge
                            color="blue-grey"
                            :label="date.formatDate(props.value, 'HH:mm:ss')"
                          />
                        </q-td>
                      </template>
                    </app-table>
                  </q-card-section>
                </q-card>
              </template>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar, date } from "quasar";
import { omit } from "lodash";
import AppTable from "components/AppTable.vue";

export default defineComponent({
  components: {
    AppTable,
  },
  setup() {
    const $q = useQuasar();
    const $store = useStore();

    const rows = computed(() => $store.getters["LOG/GET_LOGS"]);
    const columns = ref([
      {
        name: "date",
        label: "Date",
        field: (row) => row.date,
        align: "left",
      },
      {
        name: "total",
        label: "All",
        field: (row) => row.total,
        align: "left",
      },
      {
        name: "emergency",
        label: "Emergency",
        field: (row) => row.emergency,
        align: "left",
      },
      {
        name: "alert",
        label: "Alert",
        field: (row) => row.alert,
        align: "left",
      },
      {
        name: "critical",
        label: "Critical",
        field: (row) => row.critical,
        align: "left",
      },
      {
        name: "error",
        label: "Error",
        field: (row) => row.error,
        align: "left",
      },
      {
        name: "warning",
        label: "Warning",
        field: (row) => row.warning,
        align: "left",
      },
      {
        name: "notice",
        label: "Notice",
        field: (row) => row.notice,
        align: "left",
      },
      {
        name: "info",
        label: "Info",
        field: (row) => row.info,
        align: "left",
      },
      {
        name: "debug",
        label: "Debug",
        field: (row) => row.debug,
        align: "left",
      },
      {
        name: "actions",
        label: "Actions",
        align: "left",
      },
    ]);
    const route = computed(() => $store.getters["LOG/GET_ROUTE"]);

    const rows_log_items = computed(() => $store.getters["LOG/GET_LOGITEMS"]);
    const columns_log_items = ref([
      {
        name: "channel",
        label: "ENV",
        style: "width: 150px;",
        headerStyle: "width: 150px",
        field: (row) => row.channel,
        align: "left",
      },
      {
        name: "level",
        label: "Level",
        style: "width: 150px;",
        headerStyle: "width: 150px",
        field: (row) => row.level,
        align: "left",
      },
      {
        name: "created_at",
        label: "Time",
        style: "width: 150px;",
        headerStyle: "width: 150px",
        field: (row) => row.created_at,
        align: "left",
      },
      {
        name: "message",
        label: "Message",
        style: "width: 45%; word-break: break-all; white-space: pre-wrap",
        headerStyle: "width: 45%",
        field: (row) => row.message,
        align: "left",
      },
      {
        name: "context",
        label: "Context",
        style: "width: 45%; word-break: break-all; white-space: pre-wrap",
        headerStyle: "width: 45%",
        field: (row) => row.context,
        align: "left",
      },
    ]);

    const filter = ref({
      date: null,
      level: "total",
      queryStr: null,
    });
    const current_row = ref(null);
    let current_log_level = ref(null);
    const level_info = ref({
      date: { label: "Date", icon: "calendar_today", color: "blue-grey" },
      total: { label: "All", icon: "format_list_bulleted", color: "blue-grey" },
      emergency: { label: "Emergency", icon: "bug_report", color: "red-10" },
      alert: { label: "Alert", icon: "campaign", color: "red-8" },
      critical: {
        label: "Critical",
        icon: "heart_broken",
        color: "deep-orange-9",
      },
      error: { label: "Error", icon: "highlight_off", color: "deep-orange" },
      warning: { label: "Warning", icon: "warning", color: "orange" },
      notice: { label: "Notice", icon: "error_outline", color: "green" },
      info: { label: "Info", icon: "info", color: "blue" },
      debug: { label: "Debug", icon: "public", color: "blue-3" },
    });
    onMounted(async function () {
      $q.loading.show();
      await $store.dispatch(route.value.index.action);
      $q.loading.hide();
    });

    return {
      rows,
      route,
      columns,
      rows_log_items,
      columns_log_items,
      current_row,
      current_log_level,
      level_info,
      filter,
      date,
      omit,
      setRow(row) {
        filter.value = {
          date: row.date,
          level: "total",
          queryStr: "",
        };
        current_row.value = row;
        current_log_level.value = omit(current_row.value, ["date"]);
      },
      remove: async function (date) {
        $q.dialog({
          title: "Confirm",
          message: "Are you sure to remove this log ?",
          cancel: true,
          persistent: true,
        }).onOk(async function () {
          $q.loading.show();
          const response = await $store.dispatch(
            route.value.destroy.action,
            date
          );
          $q.loading.hide();
          if (response.code === "common.success") {
            current_row.value = null;
          }
        });
      },
      async onRequest(event) {
        const response = await $store.dispatch(route.value.show.action, {
          date: filter.value.date,
          form: {
            level: filter.value.level,
            queryStr: filter.value.queryStr,
            page: event.pagination.page,
            per_page: event.pagination.size,
            sort: event.pagination.descending
              ? "-" + event.pagination.sortBy
              : event.pagination.sortBy,
          },
        });
        current_log_level.value = filter.value.queryStr
          ? response.meta.levels
          : omit(current_row.value, ["date"]);
        return response;
      },
    };
  },
});
</script>
<style lang="scss" scoped>
.log-table-wrapper {
  min-height: 25vh;
}
.log-detail-wrapper {
  padding: 0 10px 10px 0;
  span.title {
    display: block;
    font-size: 24px;
    font-weight: 500;
    padding: 0 0 5px 15px;
  }
  .log-info-list {
    padding: 0;
    .info-list {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
    }
    .info-item {
      width: 300px;
      span {
        margin-right: 30px;
      }
    }
  }
}
.level-item-table {
  box-shadow: none;
  margin-top: 20px;
  .q-table__card {
    border: 1px solid $grey-4;
  }
}
.q-table__card {
  box-shadow: none;
  .q-table__top {
    padding: 0;
  }
  .q-table__bottom {
    justify-content: center;
  }
  td {
    white-space: initial;
  }
}
.log-search-input {
  .q-field__control,
  .q-field__marginal {
    height: 45px;
  }
  .q-field__control {
    padding: 0 0 0 15px;
  }
  .q-field__marginal {
    padding: 0 15px;
    border-radius: 0 4px 4px 0;
  }
}
</style>
