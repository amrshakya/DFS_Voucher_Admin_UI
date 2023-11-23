<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="form.username"
            label="Username"
            filled
            @blur="v$.username.$touch"
            :error="v$.username.$error"
            :error-message="v$.username.$errors[0]?.$message"
          />
          <q-select
            v-model="form.groupId"
            label="Operator Group"
            :options="groups"
            option-value="Id"
            option-label="GroupName"
            emit-value
            map-options
            filled
            @blur="v$.groupId.$touch"
            :error="v$.groupId.$error"
            :error-message="v$.groupId.$errors[0]?.$message"
          />
          <q-input
            v-model="form.password"
            label="Password"
            filled
            @blur="v$.password.$touch"
            :error="v$.password.$error"
            :error-message="v$.password.$errors[0]?.$message"
          />
          <q-select
            v-model="form.status"
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
    const route = computed(() => $store.getters["ADMIN/GET_ROUTE"]);
    const form = reactive({
      name: "",
      groupId: null,
      username: "",
      password: "",
      status: null,
    });
    const rules = {
      groupId: { required },
      username: { required },
      password: { required },
      status: { required }
    };
    const v$ = useVuelidate(rules, form);

    onMounted(async function() {
      $q.loading.show();
      await $store.dispatch("GROUP/INDEX");
      $q.loading.hide();
    })

    return {
      form,
      v$,
      groups: computed(() => $store.getters["GROUP/GET_GROUP"]),
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
