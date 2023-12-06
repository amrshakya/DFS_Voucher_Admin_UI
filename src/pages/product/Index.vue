<template>
  <q-page class="q-pa-md">
  <!-- Product Images -->
    <q-dialog
      v-model="product_images.dialog"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">Voucher Images - {{ current_row.Name }}</div>
        </q-card-section>
        <q-card-section>
          <div class="row q-col-gutter-sm justify-start items-stretch">
            <div class="col-12 col-sm-6" v-for="(img, index) in product_images.images" :key="index">
              <q-img
                :src="img.ImgUrl"
                spinner-color="white"
                fit="contain"
                style="min-height: 200px; background-color: rgba(0, 0, 0, 0.4);"
              >
                <div v-show="$can('read', route.remove_image.permission)" class="absolute-bottom text-subtitle1 text-center">
                  <q-btn color="red" glossy icon="delete" label="Remove" @click="remove_image(img)" />
                </div>
              </q-img>
            </div>
            <q-form class="col-12">
              <file-picker
                label="Voucher Image (Below 300kb)"
                v-model="product_images.form$.image"
                @change="handle_file_upload"
              />
              <q-card-actions align="right" v-show="product_images.form$.image">
                <q-btn color="red" glossy label="Remove" @click="undo_upload_image()" />
                <q-btn color="green" glossy label="Upload" @click="submit_upload_image(current_row)" />
              </q-card-actions>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-card>
      <q-card-section class="q-pa-none">
        <div class="row q-pa-md q-col-gutter-sm justify-end">
          <div class="col-3">
            <q-select
              v-model="searchFilter.merchantId"
              square
              outlined
              :options="merchant"
              option-value="Id"
              option-label="MerchantName"
              label="Merchant"
              emit-value
              map-options
              clearable
            />
          </div>
          <div class="col-3">
            <q-select
              v-model="searchFilter.currency"
              square
              outlined
              :options="currency"
              label="Currency"
              emit-value
              map-options
              clearable
            />
          </div>
          <div class="col-3">
            <q-select
              v-model="searchFilter.country"
              square
              outlined
              :options="country"
              label="Country"
              emit-value
              map-options
              clearable
            />
          </div>
          <div class="col-3">
            <search-filter
              v-model="searchFilter.name"
              label="Voucher Name"
              placeholder="Voucher Name"
            ></search-filter>
          </div>
          <div class="col-3">
            <search-filter
              v-model="searchFilter.sku"
              label="Voucher SKU"
              placeholder="Voucher SKU"
            ></search-filter>
          </div>
          <div class="col-3">
            <search-filter
              v-model="searchFilter.category"
              label="Category"
              placeholder="Category"
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
                <template v-if="col.name == 'merchantName'">
                  <q-chip v-show="props.row.MerchantName" color="positive" text-color="white">
                    {{ props.row.MerchantName }}
                  </q-chip>
                </template>
                <template v-else-if="col.name == 'category'">
                  <q-chip v-for="(cat, index) in props.row.Category" :color="[
                    'orange',
                    'positive',
                    'negative',
                    'amber',
                    'teal'
                  ][index % 5]" text-color="white" :key="`cat-${index}`">
                    {{ cat }}
                  </q-chip>
                </template>
                <template v-else-if="col.name == 'price'">
                  <q-badge
                    class="q-my-sm justify-center text-subtitle2 text-amount"
                    :color="hasDiscount(props.row) ? 'positive' : 'teal'"
                    square
                    :label="`${formatHandler.formatNumber(props.row.Price)}`"
                  /><br/>
                  <template v-if="hasDiscount(props.row)">
                    <q-badge
                      class="q-my-sm justify-center text-subtitle2 text-amount"
                      color="brown"
                      square
                      :label="`Discount: ${hasDiscount(props.row)}`"
                    /><br/>
                    <q-badge
                      class="q-my-sm justify-center text-subtitle2 text-amount"
                      color="teal"
                      square
                      :label="`Final: ${formatHandler.formatNumber(props.row.Discount)}`"
                    />
                  </template>
                </template>
                <template v-else-if="col.name == 'quantity'">
                  <q-badge
                    class="q-my-sm justify-center text-subtitle2 text-amount"
                    color="orange"
                    square
                    :label="`${formatHandler.formatNumber(props.row.Quantity, true)}`"
                  />
                </template>
                <template v-else-if="col.name == 'expiry'">
                  {{ displayExpiryRange(props.row.Expiry) }}
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
                    {{
                      status.find((v) => v.value == col.value)?.label || "--"
                    }}
                  </q-chip>
                </template>
                <template v-else-if="col.name == 'actions'">
                  <q-btn
                    v-if="route.list_image"
                    v-show="$can('read', route.list_image.permission)"
                    icon="image"
                    size="md"
                    color="secondary"
                    flat
                    dense
                    @click="show_product_image(props.row)"
                  >
                    <q-tooltip> View Images </q-tooltip>
                  </q-btn>
                  <q-btn
                    v-if="route.edit"
                    v-show="$can('read', route.edit.permission)"
                    icon="edit"
                    size="md"
                    color="secondary"
                    flat
                    dense
                    @click="table.editData(props.row)"
                  />
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
import FilePicker from "components/FilePicker.vue";
import SearchFilter from "components/SearchFilter.vue";
import { isEmpty } from "lodash";
import { useRouter, useRoute } from "vue-router";
import { formatHandler } from "src/utils";
export default defineComponent({
  components: {
    AppTableV2,
    FilePicker,
    SearchFilter,
  },
  setup() {
    const $store = useStore();
    const $router = useRouter();

    const route = computed(() => $store.getters["PRODUCT/GET_ROUTE"]);
    const $route = useRoute();
    const searchFilter = ref({ ...$route.query });
    const status = computed(() => $store.getters["PRODUCT/GET_STATUS"]);
    const discountType = computed(() => $store.getters["PRODUCT/GET_DISCOUNT_TYPE"]);

    const $q = useQuasar();
    const current_row = ref(null);
    const table = ref(null);

    const product_images = ref({
      dialog: false,
      images: null,
      form$: {
        image: null,
        imageBase64: null
      }
    })

    const columns = ref([
      {
        name: "merchantName",
        label: "Merchant Name",
        field: (row) => row.MerchantName,
        align: "left"
      },
      {
        name: "name",
        label: "Voucher Name",
        field: (row) => row.Name,
        align: "left"
      },
      {
        name: "currency",
        label: "Currency",
        field: (row) => row.Currency,
        align: "left"
      },
      {
        name: "country",
        label: "Country",
        field: (row) => row.Country,
        align: "left"
      },
      {
        name: "sku",
        label: "SKU",
        field: (row) => row.SKU,
        align: "left"
      },
      {
        name: "category",
        label: "Category",
        field: (row) => row.Category,
        align: 'left'
      },
      {
        name: "price",
        label: "Diamonds",
        field: (row) => row.Price,
        align: "left"
      },
      {
        name: "quantity",
        label: "Quantity",
        field: (row) => row.Quantity,
        align: "left"
      },
      {
        name: "expiry",
        label: "Expiry Range",
        field: (row) => row.Expiry,
        align: "left"
      },
      {
        name: "status",
        label: "Status",
        field: (row) => row.Status,
        align: "left"
      },
      {
        name: "addTime",
        label: "Added On",
        field: (row) => row.AddTime,
        align: "left"
      },
      {
        name: "actions",
        label: "Actions",
        field: "actions",
        align: "left"
      },
    ]);

    onMounted(async function () {
      $q.loading.show();
      await $store.dispatch("MERCHANT/INDEX", { isExport: true });
      await $store.dispatch("SETTING/CURRENCY_LIST");
      $q.loading.hide();
    })

    function displayExpiryRange (expiry) {
      if (isEmpty(expiry) || expiry.type == null) return '--';
      return `${expiry.value} ${expiry.type}`
    }

    function hasDiscount (row, calc = false) {
      const disType = discountType.value.find((v) => v.value == row.DiscountType)?.label
      if (disType == 'No Discount') return false;
      else if (disType == 'Fixed Price') return row.DiscountValue;
      else if (disType == 'Percentage') return `${formatHandler.formatNumber(row.DiscountValue, true)}%`
    }

    async function show_product_image (row) {
      $q.loading.show();
      const response = await $store.dispatch(route.value.list_image.action, {
        id: row.Id
      });
      $q.loading.hide();
      if (response.code == "common.success") {
        current_row.value = row;
        product_images.value.dialog = true;
        product_images.value.images = response.data;
      }
    }

    function handle_file_upload (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;
        product_images.value.form$.imageBase64 = base64Data;
      }
      reader.readAsDataURL(product_images.value.form$.image);
    }

    function undo_upload_image () {
      product_images.value.form$.image = null;
      product_images.value.form$.imageBase64 = null;
    }

    function submit_upload_image (row) {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure to upload image?",
        cancel: true,
        persistent: true
      }).onOk(async () => {
        $q.loading.show();
        const response = await $store.dispatch(route.value.edit_image.action, {
          id: row.Id,
          form: {
            image: product_images.value.form$.imageBase64
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

    function remove_image (row) {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure to remove image?",
        cancel: true,
        persistent: true
      }).onOk(async () => {
        $q.loading.show();
        const response = await $store.dispatch(route.value.remove_image.action, row.Id);
        if (response.code == "common.success") {
          product_images.value.images = product_images.value.images.filter(x => x.Id != row.Id);
        }
        $q.loading.hide();
      })
    }

    return {
      merchant: computed(() => $store.getters["MERCHANT/GET_MERCHANTS"]),
      currency: computed(() => $store.getters["SETTING/GET_CURRENCY_ONLY_LIST"]),
      country: computed(() => $store.getters["SETTING/GET_COUNTRY_LIST"]),
      undo_upload_image,
      remove_image,
      product_images,
      handle_file_upload,
      submit_upload_image,
      show_product_image,
      status,
      table,
      hasDiscount,
      discountType,
      displayExpiryRange,
      current_row,
      formatHandler,
      searchFilter,
      columns,
      storeListGettersPath: "PRODUCT/GET_PRODUCT",
      storePaginationGettersPath: "PRODUCT/GET_PRODUCT_PAGINATION",
      route,
      $router,
    };
  },
});
</script>
<style lang="scss" scoped>
.q-dialog .q-card {
  width: 60vw;
  .q-btn.bg-teal {
    padding: 0 24px;
  }
}
.q-table__container:deep() .q-table tbody .q-td.actions {
  text-align: right !important;
}
</style>
