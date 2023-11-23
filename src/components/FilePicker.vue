<template>
  <div>
    <q-file v-bind="props" v-model="model" />
    <div class="preview" v-show="model">
      <q-img
        v-for="(img, i) of images"
        :key="i"
        :src="img"
        spinner-color="white"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
export default defineComponent({
  name: "FilePicker",
  props: {
    modelValue: {
      type: [File, FileList, Array],
    },
    label: {
      type: String,
      required: true,
    },
    rules: {
      type: Array,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    clearIcon: {
      type: String,
      default: "close",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    maxFileSize: {
      type: [Number, String],
    },
    maxTotalSize: {
      type: [Number, String],
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const images = ref([]);

    return {
      model: computed({
        get: () => props.modelValue,
        set: (v) => {
          emit("update:modelValue", v);
          images.value = [];
          if (!v) {
            return;
          }
          if (Array.isArray(v)) {
            for (let i = 0; i < v?.length; ++i) {
              const reader = new FileReader();
              reader.onload = (e) => {
                images.value.push(e.target.result);
              };
              reader.readAsDataURL(v[i]);
            }
          } else {
            const reader = new FileReader();
            reader.onload = (e) => {
              images.value.push(e.target.result);
            };
            reader.readAsDataURL(v);
          }
        },
      }),
      images,
      props,
    };
  },
});
</script>
