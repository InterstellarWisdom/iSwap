<template>
  <div id="nav">
    <div>
      <router-link to="/" :active-class="'active-nav'">Swap</router-link>
      <router-link to="/pool" :active-class="'active-nav'">Pool</router-link>
    </div>
    <div class="account-container">
      <Account></Account>
    </div>

  </div>
  <div class="main-container">
    <router-view />
  </div>
</template>

<style lang="less">
  @import url("./App.less");
</style>
<script lang="ts">
  import { AppTs } from "./AppTs";
  export default AppTs
</script>