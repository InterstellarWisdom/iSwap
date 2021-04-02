<template>
  <div id="nav">
    <router-link to="/" :active-class="'active-nav'">Swap</router-link>
    <router-link to="/pool" :active-class="'active-nav'">Pool</router-link>
  </div>
  <router-view />
</template>

<style lang="less">
  @import url("./App.less");
</style>
<script lang="ts">
  import { defineComponent } from "vue"
  export default defineComponent({
    mounted() {
      this.$store.dispatch("getTokenList")
    }
  })
</script>