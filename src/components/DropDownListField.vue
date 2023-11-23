<template>
  <slot>
    <q-input
      standout
      square
      outlined
      :model-value="modelValue"
      @update:model-value="(v) => $emit('update:modelValue', v)"
      :placeholder="placeHolder"
      :label="label"
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
    placeHolder: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "Search",
      required: false,
    },
  },
  emits: ["update:modelValue"],
  setup() {
    return {};
  },
});
</script>
