<template>
  <div style="padding: 24px;">
    <div>
      <router-link to="/icon">Icon</router-link>
      <router-link to="/button">Button</router-link>
      <router-link to="/link">Link</router-link>
    </div>
    <div style="margin-top: 24px">
      <router-view />
    </div>
  </div>
</template>

<script>
  export default {

  };
</script>

<style lang="less">
  @import "../src/style/index.less";
</style>