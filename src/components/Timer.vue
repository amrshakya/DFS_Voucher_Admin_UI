<template>
  <span class="timer">
    <template v-if="expireTime">{{ countdown }}</template>
  </span>
</template>

<script>
import { defineComponent, ref } from "vue";
import moment from 'moment-timezone';

export default defineComponent({
  name: 'Timer',
  props: {
    timezone: {
      type: String,
      required: true
    },
    expireTime: {
      type: String,
      required: true
    }
  },
  setup (props) {
    let days = ref('00');
    let hours = ref('00');
    let minutes = ref('00');
    let seconds = ref('00');
    let timer = ref(null);
    let countdown = ref("00:00:00");
    let expireTime = moment(props.expireTime);
    let now = moment(moment().tz(props.timezone).format('YYYY-MM-DD HH:mm:ss'));
    let distance = ref((expireTime.diff(now, 'ms') > 0 ? expireTime.diff(now, 'ms') : 0));

    updateTimer()
    timer = setInterval(() => {
      distance.value = expireTime.diff(moment(moment().tz(props.timezone).format('YYYY-MM-DD HH:mm:ss')), 'ms');
      if (distance.value < 0) {
        clearInterval(timer);
        distance.value = 0;
      }
      updateTimer();
    }, 1000);
    function padNum(num) {
      var zero = '';
      for (var i = 0; i < 2; i++) {
          zero += '0';
      }
      return (zero + num).slice(-2);
    }
    function updateTimer () {
      days.value = padNum( Math.floor(distance.value / (1000*60*60*24)) );
      hours.value = padNum( Math.floor((distance.value % (1000*60*60*24)) / (1000*60*60)) );
      minutes.value = padNum( Math.floor((distance.value % (1000*60*60)) / (1000*60)) );
      seconds.value = padNum( Math.floor((distance.value % (1000*60)) / 1000) );
      countdown.value = distance.value < 0 ? '-' : `${hours.value} : ${minutes.value} : ${seconds.value}`;
    };
    return {
      countdown
    }
  }
})
</script>

<style lang="scss" scoped>
.timer {
  color: red;
  font-weight: bold;
}
</style>
