<template>
  <q-input
    square
    filled
    v-model="value"
    :label="label"
    clearable
    clear-icon="close"
    :input-style="{
      'min-width': range ? '230px' : '115px',
    }"
    @clear="value = null"
  >
    <!-- Date picker -->
    <template v-slot:prepend>
      <q-icon
        name="event"
        class="cursor-pointer"
        @click="dialog_date = !dialog_date"
      >
        <q-dialog
          v-model="dialog_date"
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="value"
            mask="YYYY-MM-DD HH:mm"
            :range="range"
            :rules="['date']"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-dialog>
      </q-icon>
    </template>
    <!-- Time picker -->
    <template v-slot:append>
      <q-icon
        name="access_time"
        class="cursor-pointer"
        @click="dialog_timer = !dialog_timer"
      >
        <q-dialog
          v-model="dialog_timer"
          transition-show="scale"
          transition-hide="scale"
          @before-show="beforeShow"
        >
          <div v-if="range" class="column bg-white">
            <q-time
              landscape
              class="no-shadow no-border-radius"
              v-model="from"
              @update:modelValue="
                (v) => {
                  if (from && to) {
                    value = { from: from, to: to };
                  }
                }
              "
              now-btn
              mask="YYYY-MM-DD HH:mm"
              :rules="['time']"
            >
              <div class="row items-center justify-end">
                <q-btn
                  icon="close"
                  round
                  color="primary"
                  size="sm"
                  @click="from = null"
                />
              </div>
            </q-time>
            <q-time
              landscape
              class="no-shadow no-border-radius"
              v-model="to"
              @update:modelValue="
                (v) => {
                  if (from && to) {
                    value = { from: from, to: to };
                  }
                }
              "
              now-btn
              mask="YYYY-MM-DD HH:mm"
              :rules="['time']"
            >
              <div class="row items-center justify-end">
                <q-btn
                  icon="close"
                  round
                  color="primary"
                  size="sm"
                  @click="to = null"
                />
              </div>
            </q-time>
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </div>
          <q-time
            v-else
            v-model="value"
            mask="YYYY-MM-DD HH:mm"
            landscape
            now-btn
            :rules="['time']"
          />
        </q-dialog>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "FormDateTimePicker",
  props: {
    modelValue: {
      type: [String, Object],
      default: "",
    },
    label: {
      type: String,
      required: true,
    },
    range: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const value = computed({
      get: () => {
        return props.modelValue;
      },
      set: (val) => {
        if (val == null) {
          return emit("update:modelValue", val);
        }
        if (props.range) {
          if (typeof val === "string") {
            val = val.split(",");
          } else {
            val = Object.values(val);
          }
          if (val.length == 1) {
            return emit("update:modelValue", `${val[0]},${val[0]}`);
          } else {
            return emit("update:modelValue", `${val[0]},${val[1]}`);
          }
        }
        return emit("update:modelValue", val);
      },
    });
    const from = ref(null);
    const to = ref(null);

    return {
      value,
      from,
      to,
      dialog_date: ref(false),
      dialog_timer: ref(false),
      beforeShow(e) {
        if (!from.value) {
          from.value = value.value?.split(",")[0] || null;
        }
        if (!to.value) {
          to.value = value.value?.split(",")[1] || null;
        }
      },
    };
  },
});
</script>
<style lang="scss" scoped>
</style>