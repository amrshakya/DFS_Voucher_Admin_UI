<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.name"
            label="Category Name"
            filled
            @blur="v$.name.$touch"
            :error="v$.name.$error"
            :error-message="v$.name.$errors[0]?.$message"
          />
          <q-input
            v-model="form.altName"
            label="Alternate Category Name"
            filled
            @blur="v$.altName.$touch"
            :error="v$.altName.$error"
            :error-message="v$.altName.$errors[0]?.$message"
          />
          <q-input
            v-model="form.description"
            type="textarea"
            label="Description"
            filled
            @blur="v$.description.$touch"
            :error="v$.description.$error"
            :error-message="v$.description.$errors[0]?.$message"
          />
          <q-input
            v-model="form.order"
            type="number"
            label="Order"
            filled
            @blur="v$.order.$touch"
            :error="v$.order.$error"
            :error-message="v$.order.$errors[0]?.$message"
          />
          <q-toggle
            v-model="form.isFlash"
            label="Is Flash Category"
            left-label
          />
          <q-input
            v-show="form.isFlash"
            :model-value="`${form.dateRange.from} - ${form.dateRange.to}`"
            label="Period Range"
            filled
            range
            :rules="[
              $rules.requiredIf(form.isFlash == true, 'Value is required')
            ]"
          >

            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.dateRange" range>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select
            v-model="form.status"
            label="Status"
            :options="[
              { label: 'Inactive', value: 0 },
              { label: 'Active', value: 1 }
            ]"
            emit-value
            map-options
            filled
            :rules="[
              $rules.required('Value is required')
            ]"
          />
          <div>
            <q-btn label="Submit" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { formatHandler } from "src/utils";
import { required, email } from "@vuelidate/validators";
import moment from 'moment-timezone';

export default defineComponent({
  components: {},
  setup() {
    const prevRoute = ref({});
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();
    const $route = useRoute();
    const id = $route.params.category;
    const route = computed(() => $store.getters["PRODUCT_CATEGORY/GET_ROUTE"]);
    let form = ref({
      name: "",
      altName: "",
      description: "",
      order: 1,
      status: null,
      isFlash: false,
      dateRange: { from: '', to: '' },
    });
    const rules = {
      name: { required },
      altName: { required },
      description: {},
      order: { required },
      isFlash: {},
      dateRange: {},
      status: { required }
    };
    const v$ = useVuelidate(rules, form);

    onMounted(async function () {
      $q.loading.show();
      const response = await $store.dispatch(route.value.list.action, {
        "id": id,
      });
      form.value = formatHandler.convertKeysToLowerCase({ ...response.data.records[0] });
      form.value.dateRange = {
        from: form.value.startTime ? moment(form.value.startTime).format('YYYY-MM-DD') : '',
        to: form.value.endTime ? moment(form.value.endTime).format('YYYY-MM-DD') : ''
      }
      form.value.isFlash = !!form.value.isFlash
      delete form.value.startTime
      delete form.value.endTime
      $q.loading.hide();
    });

    return {
      form,
      v$,
      async onSubmit() {
        const valid = await v$.value.$validate();
        if (!valid) return;
        $q.loading.show();

        const formField = { ...form.value };
        formField.startTime = formField.isFlash ? formField.dateRange.from : '';
        formField.endTime = formField.isFlash ? formField.dateRange.to : '';
        delete formField.dateRange;

        const response = await $store.dispatch(route.value.edit.action, {
          id: id,
          form: formField,
        });
        $q.loading.hide();
        if (response.code === "common.success") {
          $router.back();
        }
      },
    };
  },
});
</script>
