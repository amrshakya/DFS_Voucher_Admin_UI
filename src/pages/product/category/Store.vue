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
import { defineComponent, ref, computed, onMounted, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required, sameAs, email } from "@vuelidate/validators";

export default defineComponent({
  components: {},
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();
    const route = computed(() => $store.getters["PRODUCT_CATEGORY/GET_ROUTE"]);
    const form = reactive({
      name: "",
      description: "",
      order: 1,
      status: null,
    });
    const rules = {
      name: { required },
      description: {},
      order: { required },
      status: { required }
    };
    const v$ = useVuelidate(rules, form);

    return {
      form,
      v$,
      async onSubmit() {
        const valid = await v$.value.$validate();
        if (!valid) return;
        $q.loading.show();
        const response = await $store.dispatch(route.value.create.action, form);
        $q.loading.hide();
        if (response.code === "common.success") {
          $router.back();
        }
      },
    };
  },
});
</script>
