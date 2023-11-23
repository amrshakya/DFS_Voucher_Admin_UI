<template>
  <q-header elevated>
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        @click="toggleLeftDrawer"
        icon="menu"
        aria-label="Menu"
      />
      <q-toolbar-title>Admin Panel</q-toolbar-title>
      <q-space />
      <div class="q-gutter-sm row items-center no-wrap">
        <q-btn
          round
          dense
          flat
          color="white"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          @click="$q.fullscreen.toggle()"
          v-if="$q.screen.gt.sm"
        />
        <q-btn round>
          <q-avatar size="26px">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
                <div class="text-subtitle1 q-mt-md q-mb-xs">
                  {{ me.name }}
                </div>
                <q-btn
                  color="primary"
                  label="Logout"
                  push
                  size="sm"
                  v-close-popup
                  @click="logout"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "Header",
  setup() {
    const $store = useStore();
    const $router = useRouter();
    const $q = useQuasar();
    const me = computed(() => $store.getters["AUTH/GET_ME"]);
    const loading = ref(true);
    const visible = ref(false);

    return {
      me,
      visible,
      loading,
      logout: async function () {
        $q.loading.show();
        const response = await $store.dispatch("AUTH/LOGOUT");
        $q.loading.hide();
        if (response.code == "common.success") {
          $router.go();
        }
      },
      toggleLeftDrawer: () =>
        $store.commit(
          "UI/SET_LEFT_DRAWER",
          !$store.getters["UI/GET_LEFT_DRAWER"]
        ),
    };
  },
});
</script>

<style lang="scss" scoped>
.menu-container {
  min-width: 400px;
  .q-inner-loading {
    min-height: 60px;
  }
  .q-inner-loading {
    padding: 10px;
  }
}
</style>
