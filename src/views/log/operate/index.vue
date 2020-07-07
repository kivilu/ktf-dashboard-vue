<template>
  <sys-log :log-type="logType" />
</template>

<script>
import SysLog from '../components/sys-log'
import { LOG } from '@/api/sys/log'

export default {
  components: {
    SysLog
  },
  data() {
    return {}
  },
  computed: {
    logType: {
      get() {
        return LOG.operate
      }
    }
  },
  created() {},
  methods: {}
}
</script>
