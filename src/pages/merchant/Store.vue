<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
          :ref="(el) => (form$ = el)"
        >
          <q-input
            name="merchantName"
            v-model="form.merchantName"
            label="Merchant Name"
            filled
            lazy-rules
            :rules="[$rules.required('Value is required')]"
          />
          <q-input
            name="usernmae"
            v-model="form.username"
            label="Username"
            filled
            lazy-rules
            :rules="[
              $rules.required('Value is required')
            ]"
          />
          <q-input
            name="password"
            type="text"
            v-model="form.password"
            label="Password"
            filled
            lazy-rules
            :rules="[$rules.required('Value is required')]"
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

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const $q = useQuasar();
const $store = useStore();
const $router = useRouter();

const route = computed(() => $store.getters["MERCHANT/GET_ROUTE"]);

const form = ref({
  merchantName: "",
  username: "",
  password: "",
  status: null,
});
const form$ = ref(null);

async function onSubmit() {
  const valid = await form$.value.validate();
  if (!valid) return;
  $q.loading.show();
  const response = await $store.dispatch(route.value.create.action, form.value);
  $q.loading.hide();
  if (response.code === "common.success") {
    $router.back();
  }
}
</script>
