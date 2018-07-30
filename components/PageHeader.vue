<template>
  <div class="support-top-block">
    <div class="text-xs-center"><h2>{{ text }}</h2></div>
  </div>
</template>

<script>
  export default {
    props: ['text'],
  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .support-top-block {
    padding: 100px 0;
    background-color: $light-gray-bg;
    position: relative;
    top: -10px;

    h2 {
      font-size: 32px;
    }
  }

  @media (max-width: 375px) {
    .support-top-block {
      padding: 50px 0;

      h2 {
        font-size: 28px;
      }
    }
  }

</style>
