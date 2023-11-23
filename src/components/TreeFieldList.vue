<template>
  <q-item-label header>
    <q-form v-if="addable" ref="add_form">
      <q-input
        class="text-weight-bold"
        v-model="node_name"
        :label="label"
        filled
        :rules="nameRules"
        lazy-rules
      >
        <template v-slot:after>
          <q-btn
            class="q-ml-sm"
            size="md"
            @click="add"
            round
            color="primary"
            icon="add_circle"
          />
        </template>
      </q-input>
    </q-form>
    <span v-else>{{ label }} </span>
  </q-item-label>
  <q-item-section>
    <q-tree :nodes="nodes" :node-key="nodeKey" :tick-strategy="tickStrategy" children-key="children">
      <template v-slot:default-header="props">
        <div v-if="props.node.children" class="row items-center">
          <div class="text-weight-bold text-primary">
            {{ props.node.label }}
          </div>
          <q-btn
            v-if="
              removable &&
              props.node.children &&
              (clearable || nodes.length > 1)
            "
            round
            icon="remove"
            color="negative"
            size="md"
            class="q-mr-sm q-ml-lg"
            @click="(e) => remove(e, props.node)"
          />
        </div>
      </template>
      <template v-slot:default-body="props">
        <slot :name="`body-${props.node.key}`" v-bind="props">
          <template v-if="editable && props.node.value != undefined">
            <q-toggle
              v-if="typeof props.node.value == 'boolean'"
              v-model="props.node.value"
              :label="props.node.label"
              left-label
              @update:model-value="(v) => update(props.node, v)"
              :rules="nodeRules[props.node.label]"
            />
            <q-input
              v-else
              class="text-weight-bold"
              v-model="props.node.value"
              filled
              lazy-rules
              :label="props.node.label"
              @update:model-value="(v) => update(props.node, v)"
              :rules="nodeRules[props.node.label]"
            />
          </template>
          <span v-else class="text-weight-light text-black">
            {{ props.node.value }}
          </span>
        </slot>
      </template>
    </q-tree>
  </q-item-section>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { transform, cloneDeep, set, findLastKey } from "lodash";
import { $rules } from "boot/vuelidate";

export default defineComponent({
  name: "TreeFieldList",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    nameRules: {
      type: Array,
      default: () => [$rules.required("Value is required")],
    },
    node: {
      type: Object,
      required: true,
    },
    nodeRules: {
      type: Object,
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
    nodeKey: {
      type: String,
      default: 'label'
    },
    tickStrategy: {
      type: String,
      default: 'leaf'
    }
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const node_name = ref("");
    const add_form = ref(null);
    const trans_fn = function (r, v, k) {
      if (v instanceof Object && !Array.isArray(v)) {
        let parent_key =
          r[0] && r[0]["__parent"] ? `${r[0]["__parent"]}.${k}` : k;
        r.push({
          label: k,
          key: parent_key,
          children: transform(v, trans_fn, [
            { __parent: parent_key, __last: findLastKey(v) },
          ]),
        });
      } else if (r[0] && r[0]["__parent"]) {
        r.push({ label: k, value: v, key: `${r[0]["__parent"]}.${k}` });
        if (k == r[0]["__last"]) {
          r.shift();
        }
      } else {
        r.push({ label: k, value: v, key: k });
      }
    };
    const nodes = computed(() => transform(props.modelValue, trans_fn, []));

    return {
      nodes,
      node_name,
      add_form,
      update(node, v) {
        let _nodes = cloneDeep(props.modelValue);
        set(_nodes, node.key, v);
        emit("update:modelValue", _nodes);
      },
      async add() {
        const valid = await add_form.value.validate();
        if (!valid) return;
        let _nodes = cloneDeep(props.modelValue);
        _nodes[node_name.value] = cloneDeep(props.node);
        emit("update:modelValue", _nodes);
      },
      remove(e, node) {
        e.stopPropagation();
        let _nodes = cloneDeep(props.modelValue);
        delete _nodes[node.label];
        emit("update:modelValue", _nodes);
      },
    };
  },
});
</script>
