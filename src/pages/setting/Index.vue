<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-sm q-ma-xs q-mb-sm">
      <div class="col-md-6 col-xs-12" v-for="row in rows" :key="row.key">
        <q-card>
          <q-card-section class="q-pt-sm text-center">
            <div class="text-h6 text-grey-8">{{ row.key }}</div>
            <div class="text-caption text-grey-8"></div>
            <q-btn color="grey" round flat dense :icon="row.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              @click="expand(row)" />
          </q-card-section>
          <q-slide-transition>
            <q-form :ref="
              (el) => {
                if (el) row.form = el;
              }
            " v-show="row.expand">
              <q-card-section class="text-subitle2" v-for="(setting, key) in row.setting" :key="key">
                <text-field-list v-if="['admin.white_lists'].includes(`${row.key}.${key}`)" v-model="row.setting[key]"
                  :label="key" :rules="[
                    $rules.required('Value is required'),
                    $rules.ipAddress('Value should be ipAddress'),
                  ]" />
                <form-slider v-else-if="
                  'agent.default_downline_slot' == `${row.key}.${key}`
                " v-model="row.setting[key]" :label="'Default Downline Slot'" :min="0" :step="1"
                  :max="Number(row.setting.max_downline_slot)" />
                <form-slider v-else-if="
                  'reseller.default_pending_limit' == `${row.key}.${key}`
                " v-model="row.setting[key]" :label="'Default Pending Limit'" :min="0" :step="1"
                  :max="Number(row.setting.max_pending_limit)" />
                <tree-field-list v-else-if="'merchant.two_factor_authenticator' == `${row.key}.${key}`"
                  v-model="row.setting[key]" label="Two Factor Authenticator" :editable="true" :clearable="false"
                  :removable="false" :addable="false" :name-rules="[$rules.required('Value is required')]" :node-rules="{
                    two_factor_authenticator: [
                      $rules.required('Value is required'),
                      $rules.numeric('Value must be numeric'),
                    ]
                  }" />
                <tree-field-list v-else-if="'currency.currency' == `${row.key}.${key}`" v-model="row.setting[key]"
                  label="Currency" :editable="true" :clearable="false" :removable="false" :addable="false" :node="{
                    agent_percentage: 0,
                    referrer_percentage: 0,
                    reseller_percentage: 0,
                    master_agent_percentage: 0,
                    transaction_fee_percentage: 0,
                    payin: {
                      min: 0,
                      max: 0,
                    },
                    payout: {
                      min: 0,
                      max: 0,
                    },
                  }" :name-rules="[$rules.required('Value is required')]" :node-rules="{
                    agent_percentage: [
                      $rules.required('Value is required'),
                      $rules.numeric('Value must be numeric'),
                    ],
                    referrer_percentage: [
                      $rules.required('Value is required'),
                      $rules.numeric('Value must be numeric'),
                    ],
                    reseller_percentage: [
                      $rules.required('Value is required'),
                      $rules.numeric('Value must be numeric'),
                    ],
                    master_agent_percentage: [
                      $rules.required('Value is required'),
                      $rules.numeric('Value must be numeric'),
                    ],
                    transaction_fee_percentage: [
                      $rules.required('Value is required'),
                      $rules.numeric('Value must be numeric'),
                    ],
                  }" />
                <q-input v-else v-model="row.setting[key]" :label="
                  key
                    .toString()
                    .split('_')
                    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
                    .join(' ')
                " filled :rules="rules[key]" lazy-rules />
              </q-card-section>
              <q-card-actions align="around">
                <q-btn v-show="$can('read', route.edit.permission)" rounded label="Reset" color="info"
                  @click="reset(row)" />
                <q-btn v-show="$can('read', route.edit.permission)" rounded label="Submit" color="secondary"
                  @click="edit(row)" />
              </q-card-actions>
            </q-form>
          </q-slide-transition>
          <q-inner-loading :showing="row.loading">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import { keys } from "lodash";
import { $rules } from "boot/vuelidate";
import TextFieldList from "components/TextFieldList.vue";
import TreeFieldList from "components/TreeFieldList.vue";
import FormSlider from "components/FormSlider.vue";
import Decimal from "decimal.js";

export default defineComponent({
  components: { TextFieldList, FormSlider, TreeFieldList },
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const route = computed(() => $store.getters["SETTING/GET_ROUTE"]);
    const rules = {
      max_pending_limit: [
        $rules.required("Value is required"),
        $rules.numeric("Value should be numeric"),
      ],
      max_downline_slot: [
        $rules.required("Value is required"),
        $rules.numeric("Value should be numeric"),
      ],
    };
    const rows = ref([]);

    onMounted(async function () {
      $q.loading.show();
      await $store.dispatch(route.value.index.action, {});
      rows.value = keys($store.getters["SETTING/GET_SETTINGS"]).map((v) => {
        return {
          key: v,
          expand: false,
          loading: false,
          setting: null,
        };
      });
      $q.loading.hide();
    });

    return {
      rows,
      route,
      rules,
      Decimal,
      async edit(row) {
        const valid = await row.form.validate();
        if (!valid) {
          return;
        }
        await $store.dispatch(route.value.edit.action, {
          key: row.key,
          form: {
            ...row.setting,
            name: row.key,
          },
        });
        $q.loading.hide();
      },
      reset(row) {
        row.setting = { ...$store.getters["SETTING/GET_KEY"](row.key) };
        row.form.resetValidation();
      },
      async expand(row) {
        row.setting = null;
        row.expand = !row.expand;
        if (!row.expand) {
          return;
        }
        row.loading = true;
        const response = await $store.dispatch(route.value.index.action, {
          key: row.key,
        });
        row.loading = false;
        if (response.code === "common.success") {
          row.setting = { ...response.data };
          row.form = null;
        }
      },
    };
  },
});
</script>
