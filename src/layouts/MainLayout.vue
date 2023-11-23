<template>
  <q-layout view="lHh Lpr lFf">
    <app-header />
    <app-sidebar />
    <q-page-container class="bg-grey-2 text-black">
      <q-page-sticky
        expand
        position="top"
        style="z-index: 2000"
        class="q-py-xs bg-grey-2"
      >
        <q-toolbar style="min-height: 50px">
          <q-tabs
            shrink
            inline-label
            :modelValue="$route.name"
            indicator-color="transparent"
          >
            <q-tab
              v-for="(tab, index) in history_routes"
              :key="index"
              :ripple="false"
              :label="$t(tab.name)"
              :name="tab.name"
              :class="{
                'bg-primary': !tab.active,
                'bg-teal': tab.active,
              }"
              @click="$router.push({ name: tab.name })"
              class="text-white q-mr-sm"
              exact
              style="padding: 0 8px; min-height: 24px; border-radius: 1rem"
            >
              <q-icon size="18px" name="close" @click.stop="removeTab(tab)" />
            </q-tab>
          </q-tabs>
        </q-toolbar>
      </q-page-sticky>
      <h5
        v-if="showTitle($route.name.toString())"
        class="q-my-sm q-ml-md"
        :class="$q.dark.isActive ? 'text-white' : 'text-black'"
        style="padding-top: 52px"
      >
        {{ $t($route.name.toString()) }}
      </h5>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";
import AppHeader from "./Header";
import AppSidebar from "./Sidebar";

export default defineComponent({
  name: "MainLayout",

  components: {
    AppHeader,
    AppSidebar,
  },

  setup() {
    const $q = useQuasar();
    const $store = useStore();

    return {
      history_routes: computed(() => $store.getters["UI/GET_HISTORY_ROUTES"]),
      showTitle(routeName) {
        return (
          ["admin.home.index"].indexOf(routeName) == -1
        );
      },
      removeTab(tab) {
        $store.commit("UI/DELETE_HISTORY_ROUTE", tab);
      },
    };
  },
});
</script>
