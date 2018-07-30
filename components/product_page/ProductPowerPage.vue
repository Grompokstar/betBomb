<template>
  <div class="product-page-content">
    <div class="page-title mmb-4">
      Power
    </div>

    <v-layout class="no-shrink">
      <div class="width-170 mmr-4 text-xs-center" v-if="stopMachinePreloader">
        <img width=45px height=45px src="~assets/images/preloader.svg">
      </div>
      <template v-else>
        <v-flex>
          <button v-show="showStopButton"
                  class="boodet-btn width-170 mmr-4"
                  @click="stopProduct">
            {{ $t('productPage.powerButtons.stop') }}
          </button>
        </v-flex>
        <v-flex>
          <button v-show="showStartButton"
                  class="boodet-btn width-170 mmr-4"
                  @click="startProduct">
            {{ $t('productPage.powerButtons.start') }}
          </button>
        </v-flex>
      </template>
      <div class="width-170 mmr-4 text-xs-center" v-if="resetMachinePreloader">
        <img width=45px height=45px src="~assets/images/preloader.svg">
      </div>
      <template v-else>
        <v-flex>
          <button class="boodet-btn width-170 mmr-4" @click="resetProduct">{{ $t('productPage.powerButtons.restart') }}</button>
        </v-flex>
      </template>
    </v-layout>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        stopMachinePreloader: false,
        resetMachinePreloader: false
      }
    },
    computed: {
      product() {
        return this.$store.state.currentProduct
      },
      showStopButton() {
        return this.$store.state.currentProduct.machine.status === 'RUNNING'
      },
      showStartButton() {
        return this.$store.state.currentProduct.machine.status === 'HALTED'
      }
    },
    methods: {
      stopProduct() {
        this.stopMachinePreloader = true;
        this.$store.dispatch('stopProduct', this.$store.state.currentProduct.machine.id).then(response => {
          this.stopMachinePreloader = false;
          if (response.status === 201) {
            this.$toast.success({title: '', message: this.$t('productPage.notifications.stopVM')});
            this.$store.commit('setMachine', response.data.machine);
          } else {
            this.$toast.error(makeErrorObject(response))
          }
        })
      },
      startProduct() {
        this.stopMachinePreloader = true;
        this.$store.dispatch('startProduct', this.$store.state.currentProduct.machine.id).then(response => {
          this.stopMachinePreloader = false;
          if (response.status === 201) {
            this.$toast.success({title: '', message: this.$t('productPage.notifications.startVM')});
            this.$store.commit('setMachine', response.data.machine);
          } else {
            this.$toast.error(makeErrorObject(response))
          }
        })
      },
      resetProduct() {
        this.resetMachinePreloader = true;
        this.$store.dispatch('resetProduct', this.$store.state.currentProduct.machine.id).then(response => {
          this.resetMachinePreloader = false;
          if (response.status === 201) {
            this.$toast.success({title: '', message: this.$t('productPage.notifications.restartVM')});
            this.$store.commit('setMachine', response.data.machine);
          } else {
            this.$toast.error(makeErrorObject(response))
          }
        })
      },
    }
  }

</script>

<style lang="stylus">

</style>
