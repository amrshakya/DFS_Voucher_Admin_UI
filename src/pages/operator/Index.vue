<template>
  <q-page class="q-pa-md">
    <!-- Assign Operator Group -->
      <q-dialog
        v-model="assign_group.dialog"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card>
          <q-card-section>
            <div class="text-h6">Assign Group - {{ current_row.Username }}</div>
          </q-card-section>
          <q-card-section>
            <q-form :ref="(el) => (assign_group.form$ = el)">
              <q-select
                v-model="assign_group.groupId"
                label="Operator Group"
                :options="groups"
                option-value="Id"
                option-label="GroupName"
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
            <q-btn flat label="OK" @click="submit_assign_group(current_row)" />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
    <!-- Reset Password -->
    <q-dialog
      v-model="reset_password.dialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Reset Password - {{ current_row.Username }}</div>
        </q-card-section>
        <q-card-section>
          <q-form :ref="(el) => (reset_password.form$ = el)">
            <q-input
              name="password"
              label="Password"
              v-model="reset_password.password"
              filled
              lazy-rules
              :rules="[$rules.required('Value is required')]"
            />
            <q-input
              name="password_confirmation"
              label="Confirm Password"
              v-model="reset_password.password_confirmation"
              filled
              lazy-rules
              :rules="[
                $rules.required('Value is required'),
                $rules.sameAs(
                  reset_password.password,
                  'Value should be same as Password field'
                ),
              ]"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="OK" @click="submit_reset_password(current_row)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-card>
      <q-card-section class="q-pa-none">
        <div class="row q-pa-md q-col-gutter-sm justify-end">
          <div class="col-3">
            <search-filter
              v-model="searchFilter.username"
              label="Name"
              placeholder="Name"
            ></search-filter>
          </div>
          <div class="col-3">
            <search-filter
              v-model="searchFilter.groupName"
              label="Role"
              placeholder="Role"
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
        <template v-slot:body-cell-actions-prepend="props">
          <q-btn
            v-show="$can('read', route.assign_group.permission)"
            icon="assignment_ind"
            size="md"
            class="q-ml-sm"
            color="secondary"
            flat
            dense
            @click="open_assign_group(props.row)">
            <q-tooltip> Assign Group </q-tooltip>
          </q-btn>
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
              v-show="$can('read', route.reset_password.permission)"
              icon="password"
              size="md"
              class="q-ml-sm"
              color="secondary"
              flat
              dense
              @click="open_reset_password_dialog(props.row)"
          >
            <q-tooltip> Reset Password </q-tooltip>
          </q-btn>
        </template>
        </app-table-v2>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
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

    const route = computed(() => $store.getters["ADMIN/GET_ROUTE"]);
    const $route = useRoute();
    const searchFilter = ref({ ...$route.query });

    const $q = useQuasar();
    const current_row = ref(null);

    const assign_group = ref({
      dialog: false,
      groupId: null,
      form$: null
    });

    const update_status = ref({
      dialog: false,
      status: null,
      form$: null
    })
    const reset_password = ref({
      dialog: false,
      password: "",
      password_confirmation: "",
      form$: null,
    });

    const columns = ref([
      {
        name: "id",
        label: "Operator Id",
        field: (row) => row.Id,
        align: "left"
      },
      {
        name: "username",
        label: "Username",
        field: (row) => row.Username,
        align: "left"
      },
      {
        name: "role",
        label: "Group",
        field: (row) => row.GroupName,
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

    onMounted(async function () {
      $q.loading.show();
      await $store.dispatch("GROUP/INDEX");
      $q.loading.hide();
    })

    function open_assign_group(row) {
      current_row.value = row;
      assign_group.value.dialog = true;
      assign_group.value.groupId = row.GroupId;
    }

    async function submit_assign_group (row) {
      const valid = await assign_group.value.form$.validate();
      if (!valid) return;
      $q.dialog({
        title: "Confirm",
        message: "Are you sure to assign to the group?",
        cancel: true,
        persistent: true
      }).onOk(async () => {
        $q.loading.show();
        const response = await $store.dispatch(route.value.assign_group.action, {
          id: current_row.value.Id,
          form: {
            groupId: assign_group.value.groupId
          }
        })
        $q.loading.hide();

        assign_group.value.dialog = false;
        assign_group.value.groupId = null;
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

    function open_reset_password_dialog(row) {
      current_row.value = row;
      reset_password.value.dialog = true;
      reset_password.value.password = "";
      reset_password.value.password_confirmation = "";
    }

    async function submit_reset_password(row) {
      const valid = await reset_password.value.form$.validate();
      if (!valid) return;
      $q.dialog({
        title: "Confirm",
        message: "Are you sure to reset password?",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        $q.loading.show();
        const response = await $store.dispatch(route.value.reset_password.action, {
          id: current_row.value.Id,
          form: {
            password: reset_password.value.password
          },
        });
        $q.loading.hide();

        reset_password.value.dialog = false;
        reset_password.value.password = "";
        reset_password.value.password_confirmation = "";
      });
    }

    return {
      groups: computed(() => $store.getters['GROUP/GET_GROUP']),
      assign_group,
      open_assign_group,
      submit_assign_group,
      update_status,
      open_update_status,
      submit_update_status,
      open_reset_password_dialog,
      submit_reset_password,
      reset_password,
      current_row,
      searchFilter,
      columns,
      storeListGettersPath: "ADMIN/GET_ADMINS",
      storePaginationGettersPath: "ADMIN/GET_ADMINS_PAGINATION",
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
