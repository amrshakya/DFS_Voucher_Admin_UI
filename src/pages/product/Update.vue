<template>
  <q-page>
    <q-card>
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div class="row q-col-gutter-sm justify-start">
            <q-select
              class="col-12"
              v-model="form.type"
              label="Voucher Type"
              :options="productType"
              emit-value
              map-options
              readonly
              filled
              @blur="v$.type.$touch"
              :error="v$.type.$error"
              :error-message="v$.type.$errors[0]?.$message"
            />
            <q-select
              class="col-12 col-sm-6"
              v-show="form.type && form.type != 3"
              v-model="form.merchantId"
              label="Merchant"
              :options="merchants"
              option-value="Id"
              option-label="MerchantName"
              emit-value
              map-options
              readonly
              filled
              clearable
              @blur="v$.merchantId.$touch"
              :error="v$.merchantId.$error"
              :error-message="v$.merchantId.$errors[0]?.$message"
            />
            <q-select
              class="col-12 col-sm-6"
              v-show="form.type && form.type != 3"
              v-model="form.currency"
              label="Currency"
              :options="currency"
              readonly
              emit-value
              map-options
              filled
              clearable
              @blur="v$.currency.$touch"
              :error="v$.currency.$error"
              :error-message="v$.currency.$errors[0]?.$message"
            />
            <q-input
              class="col-12 col-sm-4"
              v-model="form.name"
              label="Voucher Name"
              filled
              @blur="v$.name.$touch"
              :error="v$.name.$error"
              :error-message="v$.name.$errors[0]?.$message"
            />
            <q-input
              class="col-12 col-sm-4"
              v-model="form.sku"
              label="Voucher SKU"
              filled
              readonly
              @blur="v$.sku.$touch"
              :error="v$.sku.$error"
              :error-message="v$.sku.$errors[0]?.$message"
            />
            <q-select
              class="col-12 col-sm-4"
              v-model="form.categoryId"
              label="Category"
              :options="category"
              option-value="Id"
              option-label="Name"
              emit-value
              map-options
              multiple
              use-chips
              filled
              clearable
              @blur="v$.categoryId.$touch"
              :error="v$.categoryId.$error"
              :error-message="v$.categoryId.$errors[0]?.$message"
            />
            <q-input
              class="col-12"
              v-model="form.description"
              type="textarea"
              label="Description"
              filled
              @blur="v$.description.$touch"
              :error="v$.description.$error"
              :error-message="v$.description.$errors[0]?.$message"
            />
            <q-input
              class="col-12 col-sm-6"
              v-model="form.price"
              label="Diamonds"
              type="number"
              filled
              @blur="v$.price.$touch"
              :error="v$.price.$error"
              :error-message="v$.price.$errors[0]?.$message"
            />
            <q-input
              class="col-12 col-sm-6"
              v-model="form.quantity"
              label="Redeem Quantity"
              type="number"
              filled
              @blur="v$.quantity.$touch"
              :error="v$.quantity.$error"
              :error-message="v$.quantity.$errors[0]?.$message"
            />
            <q-select
              class="col-12 col-sm-6"
              v-model="form.discountType"
              label="Discount Type"
              :options="discountType"
              emit-value
              map-options
              filled
              clearable
              @blur="v$.discountType.$touch"
              :error="v$.discountType.$error"
              :error-message="v$.discountType.$errors[0]?.$message"
            />
            <q-input
              class="col-12 col-sm-6"
              v-show="form.discountType != 0"
              v-model="form.discountValue"
              label="Discount"
              type="number"
              filled
              @blur="v$.discountValue.$touch"
              :error="v$.discountValue.$error"
              :error-message="v$.discountValue.$errors[0]?.$message"
            />
            <q-select
              class="col-12 col-sm-6"
              v-model="form.expiry.type"
              label="Voucher Expiry"
              :options="expiryType"
              emit-value
              map-options
              filled
              clearable
              @blur="v$.expiry.type.$touch"
              :error="v$.expiry.type.$error"
              :error-message="v$.expiry.type.$errors[0]?.$message"
            />
            <q-input
              class="col-12 col-sm-6"
              v-show="form.expiry.type"
              v-model="form.expiry.value"
              label="Expiry Value"
              type="number"
              filled
              @blur="v$.expiry.value.$touch"
              :error="v$.expiry.value.$error"
              :error-message="v$.expiry.value.$errors[0]?.$message"
            />
            <q-toggle v-model="form.isSales" label="Is Sales?" class="col-12 col-sm-6"/>
            <q-toggle v-model="form.status" label="Status" class="col-12 col-sm-6"/>
          </div>
          <div>
            <q-btn label="Submit" type="submit" color="primary" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute  } from "vue-router";
import { useQuasar } from "quasar";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { formatHandler } from "src/utils";
import { store } from "quasar/wrappers";

export default defineComponent({
  components: {},
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();
    const $route = useRoute();
    const id = $route.params.product;
    const route = computed(() => $store.getters["PRODUCT/GET_ROUTE"]);

    const form = ref({
      type: null,
      merchantId: null,
      name: "",
      sku: "",
      categoryId: null,
      description: "",
      currency: null,
      price: null,
      quantity: null,
      discountType: 0,
      discountValue: 0,
      expiry: {
        type: null,
        value: 0
      },
      isSales: false,
      status: true
    });
    const rules = {
      merchantId: {},
      name: { required },
      description: {},
      type: { required },
      sku: { required },
      categoryId: {},
      currency: {},
      quantity: { required },
      price: { required },
      discountType: { required },
      discountValue: {},
      expiry: {
        type: {},
        value: {}
      },
      isSales: { required },
      status: { required }
    };
    const v$ = useVuelidate(rules, form);

    onMounted(async function () {
      $q.loading.show();
      await $store.dispatch("MERCHANT/INDEX", { isExport: true });
      await $store.dispatch("PRODUCT_CATEGORY/INDEX", { isExport: true });
      const response = await $store.dispatch(route.value.list.action, {
        "id": id,
      });
      const res = response.data.records[0];
      delete res.Image;
      form.value = formatHandler.convertKeysToLowerCase({ ...res, Status: !!res.Status, IsSales: !!res.IsSales });
      $q.loading.hide();
    })

    return {
      form,
      v$,
      category: computed(() => $store.getters["PRODUCT_CATEGORY/GET_CATEGORY"]),
      discountType: computed(() => $store.getters["PRODUCT/GET_DISCOUNT_TYPE"]),
      productType: computed(() => $store.getters["PRODUCT/GET_PRODUCT_TYPE"]),
      expiryType: computed(() => $store.getters["PRODUCT/GET_PRODUCT_EXPIRY_TYPE"]),
      currency: computed(() => $store.getters["MERCHANT/GET_MERCHANT_CURRENCY"]),
      merchants: computed(() => $store.getters["MERCHANT/GET_MERCHANTS"]),
      async onSubmit() {
        const valid = await v$.value.$validate();
        if (!valid) return;
        $q.loading.show();
        const response = await $store.dispatch(route.value.edit.action, {
          id: id,
          form: form.value,
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
