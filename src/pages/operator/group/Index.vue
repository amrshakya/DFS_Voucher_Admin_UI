<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-sm q-ma-xs q-mb-sm">
      <div class=" col-md-5 col-xs-12">
        <q-card>
          <q-card-section class="q-pa-none">
            <app-table
                :rows="rows"
                :columns="columns"
                :row-key="'Id'"
                :route="route"
                :route-key="'Id'"
                @rowClick="show_privilege_list"
              >
            </app-table>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-7 col-xs-12">
        <q-card
          class="q-px-md"
          style="min-height: 200px;"
        >
          <q-card-actions align="between">
            <h5
              style="padding-top: 52px; margin-top: 0;"
            >
              Privilege List: {{ current_row?.GroupName }}
            </h5>
            <q-btn
              v-show="current_row && $can('read', route.set_privilege.permission)"
              label="Assign"
              color="secondary"
              @click="submit_assign_privilege(current_row)"
            />
          </q-card-actions>

          <q-card-section class="q-pa-none">
            <q-tree class="col-12 col-sm-6"
              :nodes="privilege_list"
              node-key="Id"
              tick-strategy="strict"
              v-model:ticked="allowd_access"
              v-model:expanded="allowd_access"
            >
              <template v-slot:default-header="props">
                {{ i18n.global.t(props.node.PrivilegeCode) }}
                &nbsp;&nbsp;&nbsp; <pre>{{ props.node.PrivilegeCode }}</pre>
              </template>
            </q-tree>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import AppTable from "components/AppTable.vue";
import { i18n } from "boot/i18n";
import { values as l_values } from "lodash";
import { useQuasar } from "quasar";

const $q = useQuasar();
const $store = useStore();
const route = computed(() => $store.getters["GROUP/GET_ROUTE"]);
const selected_nodes = ref([]);
const allowd_access = ref([]);
const privilege_list = ref([]);
const current_row = ref(null);
const columns = ref([
  {
    name: 'id',
    label: 'Group Id',
    field: (row) => row.Id,
    align: "left"
  },
  {
    name: "groupName",
    label: "Group Name",
    field: (row) => row.GroupName,
    align: "left"
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    align: "left"
  },
]);

onMounted(async function () {
  $q.loading.show();
  const res = await $store.dispatch(route.value.index.action);
  if (res.data.records.length > 0) {
    await show_privilege_list(false, res.data.records[0]);
  }
  $q.loading.hide();
});

const rows = computed(() => $store.getters["GROUP/GET_GROUP"]);

const show_privilege_list = async (event, row) => {
  $q.loading.show();
  current_row.value = row;
  await $store.dispatch("GROUP/GET_PRIVILEGE", row.Id);
  allowd_access.value = $store.getters["GROUP/GET_ALLOWED_ACCESS"];
  privilege_list.value = $store.getters['GROUP/GET_PRIVILEGE_LIST'];
  $q.loading.hide();
}

const submit_assign_privilege = async (row) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure to assign this privilege?",
    cancel: true,
    persistent: true
  }).onOk(async function () {
    $q.loading.show();
    await $store.dispatch(route.value.set_privilege.action, {
      id: row.Id,
      form: {
        privilegeIdx: l_values(allowd_access.value)
      }
    })
    $q.loading.hide();
  });
}
</script>
