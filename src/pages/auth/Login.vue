<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card
          v-bind:style="$q.screen.lt.sm ? { width: '80%' } : { width: '30%' }"
        >
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">Log in</div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit="onSubmit">
              <q-input
                v-model="form.username"
                label="Username"
                filled
                @blur="v$.username.$touch"
                :error="v$.username.$error"
                :error-message="v$.username.$errors[0]?.$message"
              />
              <q-input
                v-model="form.password"
                label="Password"
                type="password"
                filled
                @blur="v$.password.$touch"
                :error="v$.password.$error"
                :error-message="v$.password.$errors[0]?.$message"
              />

              <div>
                <q-btn label="Login" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength } from "@vuelidate/validators";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();

    const form = reactive({
      username: "",
      password: ""
    });
    const rules = {
      username: { required },
      password: {
        required,
        minLength: minLength(8),
      },
    };
    const v$ = useVuelidate(rules, form);

    return {
      form,
      v$,
      async onSubmit() {
        const valid = await v$.value.$validate();
        if (!valid) return;
        $q.loading.show();
        const response = await $store.dispatch("AUTH/LOGIN", form);
        $q.loading.hide();
        if (response.code == "common.success") {
          $router.push({ name: "admin.home.index" });
        }
      },
    };
  },
});
</script>

<style>
.bg-image {
  background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%);
}
</style>
