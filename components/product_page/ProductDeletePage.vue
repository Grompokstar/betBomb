<template>
  <div class="product-page-content">
    <div class="page-title">
      {{ $t('productPage.removeTitle') }}
    </div>
    <div class="page-description mmb-4">
      {{ $t('productPage.removeDescription') }}
    </div>

    <button class="boodet-btn width-170 mmr-4"
            @click="deleteProductDialog">
      {{ $t('productPage.removeButton') }}
    </button>

    <v-dialog v-model="confirmDialog" max-width="670px">
      <div class="close-btn"
           @click.stop="confirmDialog = !confirmDialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
          <path class="cross" fill="none" fill-rule="evenodd" stroke="#FF3200" stroke-width="2" d="M5.5 5.5L10 10 5.5 5.5 1 10l4.5-4.5zm0 0L1 1l4.5 4.5L10 1 5.5 5.5z"/>
        </svg>
      </div>

      <div class="dialog-title mmb-2">
        {{ $t('dialogs.vmRemoving') }}
      </div>
      <div class="sans-pro font-lg">
        {{ $t('dialogs.vmRemovingDescription') }}
      </div>

      <div>
        <button class="boodet-btn width-170 mmt-4 mmr-3" @click="deleteProduct">{{ $t('button.confirm') }}</button>
        <button class="mmt-4 simple-btn" @click.stop="confirmDialog = !confirmDialog">{{ $t('button.cancel') }}</button>
      </div>
    </v-dialog>

  </div>
</template>

<script>

  export default {
    props: ['product'],
    data () {
      return {
        confirmDialog: false

      }
    },

    computed: {

    },

    methods: {
      deleteProductDialog() {
        this.confirmDialog = true;
      },

      deleteProduct() {
        this.confirmDialog = false;
        this.$store.dispatch('productInstanceDelete', this.product.id).then(response => {
          if (response.status === 200) {
            this.$toast.success({title: '', message: this.$t('productPage.notifications.deleteVM')});
            this.$router.push({ path: '/products' })
          } else {
            this.$toast.error(makeErrorObject(response))
          }
        })
      }
    }
  }

</script>

<style lang="stylus">
</style>
