<template>
  <q-list id="notification">
    <template v-if="messages.length > 0">
      <q-item
        v-for="(msg, index) in messages"
        :key="index"
        clickable
        v-ripple
        :to="msg.link"
        replace
        @click="markRead(msg)"
      >
        <q-item-section>
          <div class="msg-header">
            <h4 class="notification_type">{{ msg.title }}</h4>
            <span class="time">{{ format(msg.time) }} </span>
          </div>
          <p class="message">{{ msg.body }}</p>
        </q-item-section>
      </q-item>
    </template>
    <q-item v-else>
      <q-item-section>
        <q-item-label>No notification found!</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { format } from "timeago.js";
import { useStore } from "vuex";

const $store = useStore();
const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  }
});
const markRead = function (msg) {
  $store.dispatch("NOTIFICATION/MARK", {
    mark_type: "read",
    id: [msg.id],
  });
};
</script>

<style lang="scss" scoped>
#notification.q-list {
  .q-item {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .q-item__section {
      .notification_type,
      .message {
        font-size: 0.85rem;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0px;
      }
      .msg-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        margin-bottom: 10px;
        .notification_type {
          font-size: 0.9rem;
          line-height: 22px;
          font-weight: bold;
          margin: 0;
          letter-spacing: -0.6px;
        }
      }
    }
  }
}
</style>