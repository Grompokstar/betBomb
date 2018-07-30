<template>
  <div class="product-page-content">
    <div class="page-title">
      История
    </div>
    <div class="page-description mmb-4">

    </div>

  </div>
</template>

<script>

  export default {
    data () {
      return {

      }
    },

    computed: {
      product() {
        return this.$store.state.currentProduct
      },
    },
  }

</script>

<style lang="stylus">
</style>
