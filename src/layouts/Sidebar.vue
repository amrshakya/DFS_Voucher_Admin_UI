<template>
  <q-drawer
    v-model="leftDrawerOpen"
    show-if-above
    bordered
    class="bg-primary text-white"
  >
    <q-list>
      <div v-for="menu in menus" :key="menu.label">
        <q-expansion-item
          v-if="menu.children"
          v-show="menu.children.filter((p) => $can('read', p.name)).length > 0"
          :icon="menu.icon"
          :label="menu.label"
        >
          <q-list
            v-for="submenu in menu.children"
            :key="submenu.label"
            class="q-pl-lg"
          >
            <q-item
              :to="{ name: submenu.name, query: submenu.query }"
              active-class="tab-active"
              v-show="$can('read', submenu.name)"
            >
              <q-item-section avatar>
                <q-icon :name="submenu.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ $t(submenu.name) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
        <q-item
          v-else
          v-show="$can('read', menu.name)"
          :to="{ name: menu.name }"
          active-class="tab-active"
        >
          <q-item-section avatar>
            <q-icon :name="menu.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t(menu.name) }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </q-drawer>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const $store = useStore();
    const me = computed(() => $store.getters["AUTH/GET_ME"]);

    return {
      leftDrawerOpen: computed({
        get: () => $store.getters["UI/GET_LEFT_DRAWER"],
        set: () => $store.commit("UI/SET_LEFT_DRAWER"),
      }),
      me,
      menus: ref([
        {
          name: "admin.home.index",
          icon: "dashboard",
        },
        {
          label: "Operator",
          icon: "admin_panel_settings",
          children: [
            {
              name: "admin.operator.index",
              icon: "admin_panel_settings"
            },
            {
              name: "admin.operator.group.index",
              icon: "group"
            },
          ]
        },
        {
          label: "Merchant Management",
          icon: "domain",
          children: [
            {
              name: "admin.merchant.index",
              icon: "person_pin"
            },
            {
              name: "admin.merchant.transaction.index",
              icon: "paid"
            }
          ]
        },
        {
          label: 'Voucher',
          icon: 'inventory',
          children: [
            {
              name: 'admin.product.category.index',
              icon: 'category'
            },
            {
              name: "admin.product.index",
              icon: "confirmation_number"
            }
          ]
        }
        // {
        //   label: "Logs",
        //   icon: "feedback",
        //   children: [
        //     {
        //       name: "admin.activity_logs.index",
        //       icon: "local_activity",
        //     },
        //   ],
        // }
      ]),
    };
  },
});
</script>

<style scoped>
.tab-active {
  background-color: green;
}
</style>
