<template>
  <slot>
    <q-select
      v-if="options != null && options.length > 0"
      :model-value="modelValue"
      square
      filled
      :options="options"
      :label="label"
      emit-value
      map-options
      clearable
      :option-label="optionLabel"
      @update:model-value="(v) => $emit('update:modelValue', v)"
    />

    <q-input
      v-else
      square
      filled
      :model-value="modelValue"
      @update:model-value="(v) => $emit('update:modelValue', v)"
      :placeholder="placeHolder"
      :label="label"
      clearable
    >
    </q-input>
  </slot>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "SearchFilter",
  props: {
    modelValue: {
      type: String,
      default: "",
      required: true,
    },
    options: {
      type: Array,
      required: false,
    },
    label: {
      type: String,
      default: "Search",
      required: false,
    },
    optionLabel: {
      type: String,
      default: "label",
      required: false,
    },
  },
  emits: ["update:modelValue"],
  setup() {
    return {};
  },
});
</script>
