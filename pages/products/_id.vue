<template>
  <v-container>
    <div class="product-name-row mmt-2 mmb-5">
      <div class="product-name">
        <div class="small-label-font-style">
          {{ $t('productTypes.virtualMachine') }}
        </div>
        <div class="mmb-1">
          <input
            class="prodyct-name-input"
            @change="saveProductName"
            v-model="productName">
        </div>
        <div class="product-parameters">
          <img src="~assets/images/cloud.svg" class="mmr-1">
          {{ cloudSpaceName }}
          <div class="blue-circle-divider"></div>
          {{ productParameters }}
          <div class="blue-circle-divider"></div>
          ip {{ machineIP }}
        </div>
      </div>

      <div class="text-xs-center" v-if="isChangeProductStatus">
        <img width=45px height=45px src="~assets/images/preloader.svg">
      </div>
      <template v-else>
        <div class="server-switch-state">
          <div class="product-state-switch-string" :class="productState">
            {{ productStateString }}
          </div>
          <!--<v-switch
            v-model="productState"
            @change="changeServerStatus"
            class="mmb-2"
          ></v-switch>-->
        </div>
      </template>
    </div>

    <v-layout>
      <v-flex xs2>
        <product-navigation></product-navigation>
      </v-flex>
      <v-flex xs10>
        <component :is="'product-' + productPage + '-page'" :product="product"></component>
      </v-flex>
    </v-layout>

  </v-container>
</template>


<script>
  import ProductNavigation from '~/components/product_page/ProductNavigation.vue';
  import ProductIndexPage from '~/components/product_page/ProductIndexPage.vue';
  import ProductResizePage from '~/components/product_page/ProductResizePage.vue';
  import ProductPowerPage from '~/components/product_page/ProductPowerPage.vue';
  import ProductNetworkPage from '~/components/product_page/ProductNetworkPage.vue';
  import ProductDisksPage from '~/components/product_page/ProductDisksPage.vue';
  import ProductMonitoringPage from '~/components/product_page/ProductMonitoringPage.vue';
  import ProductImagesPage from '~/components/product_page/ProductImagesPage.vue';
  import ProductBackupPage from '~/components/product_page/ProductBackupPage.vue';
  import ProductLogsPage from '~/components/product_page/ProductLogsPage.vue';
  import ProductDeletePage from '~/components/product_page/ProductDeletePage.vue';
  import ProductConsolePage from '~/components/product_page/ProductConsolePage.vue';

  import _ from 'lodash';
  import { makeErrorObject } from '../../libraries/helpers'

  export default {
    components: {
      ProductNavigation,
      ProductIndexPage,
      ProductResizePage,
      ProductPowerPage,
      ProductNetworkPage,
      ProductDisksPage,
      ProductMonitoringPage,
      ProductImagesPage,
      ProductBackupPage,
      ProductLogsPage,
      ProductDeletePage,
      ProductConsolePage
    },

    validate ({ params }) {
      return /^\d+$/.test(params.id)
    },

    beforeCreate() {
      this.$store.dispatch('getProduct', this.$route.params.id).then(response => {
        this.$store.commit('setProduct', response.product_instance);
        this.productName = this.$store.state.currentProduct.name;
        if (response.product_instance.resources[0].cloud_space_id) {
          this.$store.dispatch('getCloudSpace', response.product_instance.resources[0].cloud_space_id)
            .then(response => {
              if (response.status === 200) {
                this.$store.commit('setCurrentMachineCloudSpace', response.data.cloud_space)
              }
            })
        }
      })
    },

    beforeDestroy() {
      this.$store.commit('setActiveProductPage', 'index');
    },

    created() {
      this.productName = this.product.name;
    },

    data () {
      return {
        productId: this.$route.params.id,
        productName: '',
        isChangeProductStatus: false
      }
    },

    computed: {
      product() {
        return this.$store.state.currentProduct
      },
      productState() {
        return this.$store.state.currentProduct.machine.status;
      },
      productPage() {
        return this.$store.state.activeProductPage
      },

      productParameters() {
        let productImage = _.find(this.$store.state.libraries.images, function(image) {
          return image.id === this.$store.state.currentProduct.machine.image_id;
        }.bind(this));
        let result = '';

        result += this.$store.state.currentProduct.machine.vcpus + 'cpu / ';

        if (this.$store.state.currentProduct.machine.memory === 512) {
          result += this.$store.state.currentProduct.machine.memory + 'mb / '
        } else {
          result += this.$store.state.currentProduct.machine.memory/1024 + 'gb / '
        }
        if (productImage) {
          result += productImage.name
        } else {
          result += '-'
        }

        return result
      },
      machineIP() {
        return this.$store.state.currentProduct.machine.local_ip_address ?
          this.$store.state.currentProduct.machine.local_ip_address :
          ''
      },

      productStateString() {
        return this.$store.state.currentProduct.machine.status === 'RUNNING' ? this.$t('productStatuses.running') : this.$t('productStatuses.halted')
      },

      cloudSpaceName() {
        return this.$store.state.currentProduct.machine.cloud_space.name
      }

    },

    methods: {
      saveProductName() {
        let requestData = {
          product_instance: {
            name: this.productName
          }
        };

        this.$store.dispatch('changeProductName', {id: this.productId, request: requestData}).then(response => {
          if (response.status === 200) {
            this.$store.commit('setProductName', response.data.name);
            this.$toast.success({title: '', message: this.$t('productPage.notifications.changeProductName')})
          } else {
            this.$toast.error(makeErrorObject(response))
          }
        })
      },

      changeServerStatus() {
        this.isChangeProductStatus = true;
        if (this.$store.state.currentProduct.machine.status === 'RUNNING') {
          this.$store.dispatch('stopProduct', this.$store.state.currentProduct.machine.id).then(response => {
            this.isChangeProductStatus = false;
            if (response.status === 201) {
              this.$toast.success({title: '', message: this.$t('productPage.notifications.stopVM')});
              this.$store.commit('setMachine', response.data.machine);
            } else {
              this.$toast.error(makeErrorObject(response))
            }
          })
        } else if (this.$store.state.currentProduct.machine.status === 'HALTED') {
          this.$store.dispatch('startProduct', this.$store.state.currentProduct.machine.id).then(response => {
            this.isChangeProductStatus = false;
            if (response.status === 201) {
              this.$toast.success({title: '', message: this.$t('productPage.notifications.startVM')});
              this.$store.commit('setMachine', response.data.machine);
            } else {
              this.$toast.error(makeErrorObject(response))
            }
          })
        }
      }


    }


  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .product-name-row {
    display flex

    .product-name {
      margin-right auto
      font-size 16px

      img {
        vertical-align baseline
      }
    }

    .server-switch-state {
      display flex
      flex-basis 58px
      flex-grow 0
      margin-top 10px

      .switch {
        margin-left auto

        .input-group__input {
          justify-content flex-end
        }
      }

      .product-state-switch-string {
        font-size 16px
        color $font-color-gray
        font-weight 600
        align-self flex-end

        &.RUNNING {
          color: $blue-brand-color
        }

        &.HALTED {
          color: $red-brand-color
        }
      }
    }
  }

  .product-page-content {
    border 1px solid rgba(0,0,0,0.05)
    padding 25px 30px 30px
    position relative

    .product-price {
      position absolute
      top 25px
      right 30px
      font-size 32px
      font-weight 700
    }

    .page-title {
      font-size 20px
      font-weight 700
      line-height 1.4
      letter-spacing 0.3px
      margin-bottom 18px
    }

    .page-description {
      color $font-color-gray
      font-size 14px
      max-width 570px
    }
  }
</style>
