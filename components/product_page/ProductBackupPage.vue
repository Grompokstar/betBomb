<template>
  <div class="product-page-content">
    <div class="product-price">{{ product.price }}&nbsp;&#8381;</div>
    <div class="page-title">
      Бэкап
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
