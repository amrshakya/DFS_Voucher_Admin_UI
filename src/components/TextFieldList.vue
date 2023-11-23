<template>
  <q-item-label header class="q-px-none">
    <q-form ref="add_form" v-if="addable">
      <q-input
        class="text-weight-bold"
        v-model="text"
        :label="label"
        filled
        :rules="rules"
        lazy-rules
      >
        <template v-slot:after>
          <q-btn
            class="q-ml-sm"
            size="md"
            @click="add(text)"
            round
            color="primary"
            icon="add_circle"
          />
        </template>
      </q-input>
    </q-form>
  </q-item-label>

  <q-item v-for="(item, index) in items" :key="index" tag="label" v-ripple>
    <q-item-section>
      <slot>
        <q-input
          :model-value="item"
          @update:model-value="
            (v) => {
              items[index] = v;
              $emit('update:modelValue', items);
            }
          "
          color="primary"
          filled
          :rules="rules"
          lazy-rules
        />
      </slot>
    </q-item-section>
    <q-item-section side>
      <q-btn
        @click="remove(index)"
        round
        color="primary"
        icon="remove_circle"
      />
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, computed, ref } from "vue";

export default defineComponent({
  name: "TextFieldList",
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    rules: {
      type: Array,
      required: true,
    },
    addable: {
      type: Boolean,
      default: true,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    removable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const add_form = ref(null);
    const text = ref("");
    const items = computed({
      get: () => [...props.modelValue],
      set: (v) => emit("update:modelValue", v),
    });

    return {
      text,
      add_form,
      items,
      async add(item) {
        const valid = await add_form.value.validate();
        if (!valid) return;
        items.value = items.value.concat(item);
        text.value = "";
        add_form.value.resetValidation();
      },
      remove(index) {
        items.value = items.value.filter((v, idx) => idx != index);
      },
    };
  },
});
</script>