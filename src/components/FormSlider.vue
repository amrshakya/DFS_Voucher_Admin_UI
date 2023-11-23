<template>
  <q-item class="q-px-sm">
    <q-item-section avatar>
      {{
        label
          .toString()
          .split("_")
          .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
          .join(" ")
      }}
    </q-item-section>
    <q-item-section>
      <q-slider
        v-model="value"
        label
        label-always
        markers
        :label-value="onLabelValue(value)"
        :min="min"
        :step="step"
        :max="max"
      />
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "FormSlider",
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
    labelValue: {
      type: Function,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const value = computed({
      get: () => props.modelValue,
      set: (val) => emit("update:modelValue", val),
    });

    return {
      value,
      onLabelValue(v) {
        if (props.labelValue) {
          return props.labelValue(v);
        }
        return v;
      },
    };
  },
});
</script>
<style lang="scss" scoped>
.q-item {
  font-size: 14px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px 4px 0 0;
}
.q-item__section.q-item__section--avatar {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}
</style>
