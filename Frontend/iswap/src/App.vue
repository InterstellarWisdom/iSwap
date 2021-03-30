<template>
  <div id="nav">
    <router-link to="/" :active-class="'active-nav'">swap</router-link>
    <router-link to="/add-liquidity" :active-class="'active-nav'">add liquidity</router-link>
  </div>
  <router-view />
</template>

<style lang="less">
  @import url("./App.less");
</style>