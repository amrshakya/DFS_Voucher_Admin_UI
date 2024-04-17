<template>
  <q-page class="q-pa-md">
    <!-- Update Status -->
    <q-dialog
      v-model="assign_product.dialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Category - <strong>{{ current_row.Name }}</strong></div>
        </q-card-section>
        <q-card-section>
          <div class="row q-pa-md q-col-gutter-sm justify-between items-center">
            <div class="col-5 box-selector">
              <q-form :ref="(el) => (assign_product.form$ = el)">
                <q-checkbox v-for="(product, key) in assign_product.products" v-model="assign_product.selectorIds" :key="key" :val="product" :label="product.Name" color="teal" />
              </q-form>
            </div>
            <div class="col-2 flex column q-col-gutter-lg justify-center items-center">
              <div class="assign-wrap flex column q-col-gutter-sm justify-center items-center">
                <q-btn class="glossy" color="teal" label=">" @click="move_products(true, true)"/>
                <q-btn class="glossy" color="teal" label=">>" @click="move_products(true, false)" />
              </div>
              <div class="remove-wrap flex column q-col-gutter-sm justify-center items-center">
                <q-btn class="glossy" color="teal" label="<" @click="move_products(false, true)"/>
                <q-btn class="glossy" color="teal" label="<<" @click="move_products(false, false)"/>
              </div>
            </div>
            <div class="col-5 box-selector">
              <q-form :ref="(el) => (assign_product.form$ = el)">
                <q-checkbox v-for="(product, key) in assign_product.assigned_products" v-model="assign_product.selectedIds" :key="key" :val="product" :label="product.Name" color="teal" />
              </q-form>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="OK" @click="submit_assign_product(current_row)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-card>
      <q-card-section class="q-pa-none">
        <div class="row q-pa-md q-col-gutter-sm justify-end">
          <div class="col-3">
            <search-filter
              v-model="searchFilter.name"
              label="Category Name"
              placeholder="Category Name"
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
          :ref="(el) => (table = el)"
          :routeKey="'Id'"
          :route="route"
          :columns="columns"
          :storePaginationGettersPath="storePaginationGettersPath"
          :storeListGettersPath="storeListGettersPath"
          :searchFilter="searchFilter"
        >
        <template v-slot:body="props">
          <tr :props="props">
            <td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name == 'name'">
                {{ props.row.Name }}
                <q-chip v-show="props.row.IsFlash" dense color="orange" text-color="white">
                  Is Flash
                </q-chip>
              </template>
              <template v-else-if="col.name == 'duration'">
                <span v-if="props.row.IsFlash">
                  <span>From: {{ formatDate(props.row.StartTime) }}</span><br/>
                  <span>To: {{ formatDate(props.row.EndTime) }}</span>
                </span>
                <span v-else>-</span>
              </template>
              <template v-else-if="col.name == 'status'">
                  <q-chip
                  :clickable="false"
                  dense
                  class="text-weight-medium text-body2 text-white"
                  size="md"
                  square
                  :color="[
                    'negative',
                    'positive',
                  ][col.value]
                    "
                >
                  {{ col.value === 0 ? 'Inactive' : 'Active' }}
                </q-chip>
              </template>
              <template v-else-if="col.name == 'actions'">
                <q-btn
                  v-if="route.edit"
                  v-show="$can('read', route.assign.permission)"
                  icon="edit"
                  size="md"
                  color="secondary"
                  flat
                  dense
                  @click="table.editData(props.row)"
                />
                <q-btn
                  icon="assignment"
                  size="md"
                  class="q-ml-sm"
                  color="secondary"
                  flat
                  dense
                  @click="open_assign_product(props.row)"
                >
                  <q-tooltip> Add Products </q-tooltip>
                </q-btn>
              </template>
              <template v-else>{{ col.value }}</template>
            </td>
          </tr>
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
import { map as l_map } from "lodash";
import moment from 'moment-timezone';

export default defineComponent({
  components: {
    AppTableV2,
    SearchFilter,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();

    const route = computed(() => $store.getters["PRODUCT_CATEGORY/GET_ROUTE"]);
    const $route = useRoute();
    const searchFilter = ref({ ...$route.query });

    const $q = useQuasar();
    const current_row = ref(null);

    const as_product = ref([]);

    const assign_product = ref({
      dialog: false,
      assigned_products: null,
      products: null,
      selectorIds: [],
      selectedIds: [],
      form$: {}
    })

    const formatDate = (date) => {
      return moment(date).format("YYYY-MM-DD");
    }

    onMounted(() => {
      // open_assign_product()
    });

    const columns = ref([
      {
        name: "name",
        label: "Category Name",
        field: (row) => row.Name,
        align: "left"
      },
      {
        name: "duration",
        label: "Flash Duration",
        field: (row) => row.StartTime,
        align: "left"
      },
      {
        name: "description",
        label: "Description",
        field: (row) => row.Description,
        align: "left"
      },
      {
        name: "status",
        label: "Status",
        field: (row) => row.Status,
        align: "left"
      },
      {
        name: "actions",
        label: "Actions",
        field: "actions",
        align: "left"
      },
    ]);

    async function open_assign_product(row) {
      current_row.value = row;
      await $store.dispatch(route.value.get_product.action, {
        categoryId: row.Id
      }),
      assign_product.value.dialog = true;
      assign_product.value.assigned_products = $store.getters["PRODUCT_CATEGORY/GET_ASSIGNED_CATEGORY_PRODUCT"];
      assign_product.value.products = $store.getters["PRODUCT_CATEGORY/GET_PRODUCTS"];
    }

    function move_products (assign = true, isSingle = true) {
      const selectedIds = assign ? assign_product.value.selectorIds : assign_product.value.selectedIds;
      const sourceArray = assign ? [...assign_product.value.products] : [...assign_product.value.assigned_products];
      const targetArray = assign ? [...assign_product.value.assigned_products] : [...assign_product.value.products];

      selectedIds.forEach(ele => {
        const index = sourceArray.findIndex(item => item.ProductId === ele.ProductId);
        if (index !== -1) {
          targetArray.push(sourceArray[index]);
          sourceArray.splice(index, 1);
        }
      });

      if (assign) {
        assign_product.value.assigned_products = isSingle ? [...targetArray] : [...assign_product.value.assigned_products, ...assign_product.value.products];
        assign_product.value.products = isSingle ? [...sourceArray] : [];
      } else {
        assign_product.value.products = isSingle ? [...targetArray] : [...assign_product.value.products, ...assign_product.value.assigned_products];
        assign_product.value.assigned_products = isSingle ? [...sourceArray] : [];
      }
    }

    async function submit_assign_product(row) {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure you want to make the changes?",
        cancel: true,
        persistent: true
      }).onOk(async () => {
        $q.loading.show();
        const response = await $store.dispatch(route.value.assign.action, {
          id: row.Id,
          form: {
            productIds: l_map(assign_product.value.assigned_products, 'ProductId')
          }
        });
        $q.loading.hide();
        if (response.code == "common.success") {
          product_images.value.images = response.data;
          product_images.value.form$.image = null;
          product_images.value.form$.imageBase64 = null;
        }
      })
    }

    return {
      as_product,
      formatDate,
      assign_product,
      open_assign_product,
      submit_assign_product,
      move_products,
      current_row,
      searchFilter,
      columns,
      storeListGettersPath: "PRODUCT_CATEGORY/GET_CATEGORY",
      storePaginationGettersPath: "PRODUCT_CATEGORY/GET_CATEGORY_PAGINATION",
      route,
      $router,
    };
  },
});
</script>
<style lang="scss" scoped>
.q-dialog .q-card {
  width: 980px;
  max-width: 80vw;
  .q-btn.bg-teal {
    padding: 0 24px;
    margin: 5px 0;
  }
}
.q-table__container:deep() .q-table tbody .q-td.actions {
  text-align: right !important;
}
.box-selector {
  border: 1px solid rgba(black, .5);
  padding: 1rem;
  border-radius: 2px;
  height: 500px;
  overflow: auto;
}
.assign-wrap, .remove-wrap {
  .q-btn {
    width: 60px;
    font-size: 1.2rem;
  }
}
</style>
