<template>
  <div class="product-page-content">
    <div class="product-price">{{priceFunction(product.machine)}}&nbsp;&#8381;</div>
    <div class="page-title mmb-4">
      {{ $t('productPage.params') }}
    </div>

    <div class="mmb-5 dd-flex wrap">
      <div class="parameter-item mmr-6">
       <div class="parameter-title">CPU</div>
       <div class="parameter-value">{{ product.machine.vcpus }}</div>
      </div>
      <div class="parameter-item mmr-6">
        <div class="parameter-title">RAM</div>
        <div class="parameter-value">{{ memory }}</div>
      </div>
      <div class="parameter-item mmr-6">
        <div class="parameter-title">{{$t('productPage.bootDisk')}}</div>
        <div class="parameter-value">{{ product.machine.boot_disk_size }}&nbsp;GB</div>
      </div>
      <div class="parameter-item mmr-6">
        <div class="parameter-title">{{$t('productPage.image')}}</div>
        <div class="parameter-value">{{ imageName }}</div>
      </div>
      <div class="parameter-item mmr-6">
        <div class="parameter-title">{{$t('productPage.cloudSpace')}}</div>
        <div class="parameter-value">{{ cloudSpaceName }}</div>
      </div>
    </div>
    <!--<div class="mmb-5">
      <button class="boodet-btn width-170 mmr-4">Консоль</button>
      <nuxt-link :to="'/products'" class="sans-pro">Добавить администратора</nuxt-link>
      <div class="blue-circle-divider"></div>
      <nuxt-link :to="'/products'" class="sans-pro">Сброс пароля</nuxt-link>
    </div>

    <div class="font-xxl mmb-2">
      SSH
    </div>
    <button class="boodet-btn width-170 mmr-4">Добавить ключ</button>-->

  </div>
</template>

<script>
  import { vdcLocation } from '../../libraries/configurator_library.js';
  import { makeErrorObject, calculatePrice } from '../../libraries/helpers';
  import _ from 'lodash';

  export default {
    props: ['product'],
    data () {
      return {
        selectVdcLocation: [
          {
            text: vdcLocation[19],
            value: '19'
          },
          {
            text: vdcLocation[1],
            value: '1'
          },
          {
            text: vdcLocation[2],
            value: '2'
          }
        ],
        selectVdc: [
          {
            text: 'VDC test name',
            value: 'vdc test name'
          }
        ],
        priceFunction: calculatePrice
      }
    },

    computed: {
      /*product() {
        return this.$store.state.currentProduct
      },*/
      memory() {
        let result = ''
        if (this.product.machine.memory === 512) {
          result += this.product.machine.memory + ' MB'
        } else {
          result += this.product.machine.memory/1024 + ' GB'
        }
        return result
      },

      imageName() {
        let productImage = _.find(this.$store.state.libraries.images, function(image) {
          return image.id === this.$store.state.currentProduct.machine.image_id;
        }.bind(this));

        if (productImage) {
          return productImage.name;
        } else {
          return '-'
        }
      },

      cloudSpaceName() {
        return this.$store.state.currentProduct.machine.cloud_space.name
      }
    }
  }

</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .product-page-content {

    .parameter-item {
      margin-bottom 20px;

      .parameter-title {
        font-size 14px
        margin-bottom 13px
      }

      .parameter-value {
        font-size 18px
        font-weight 700
      }
    }
  }
</style>
