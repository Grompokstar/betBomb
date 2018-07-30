<template>
  <div class="product-page-content">
    <div class="product-price">{{ product.price }}&nbsp;&#8381;</div>
    <div class="page-title">
      Диски
    </div>
    <div class="page-description mmb-4">
      Информация о дисках, их типах и как это работает.
    </div>

    <div id="additional-disks">
      <additional-disk @removeDisk="removeDisk"
                       @changeDiskSize="changeAdditionalDiskSize"
                       @changeDiskSpeed="changeAdditionalDiskSpeed"
                       @changeDiskType="changeAdditionalDiskType"
                       v-for="item in additionalDisks"
                       :productPage="true"
                       :key="item.key"
                       :diskIndex="item.id"
                       :diskType="item.type"
                       :sliderDiskSizeValue="item.diskSize"
                       :sliderDiskSpeedValue="item.diskSpeed">

      </additional-disk>
    </div>

    <button class="boodet-btn" @click="addDisk">Добавить диск</button>

  </div>
</template>

<script>
  import AdditionalDisk from '~/components/AdditionalDisk.vue';
  import _ from 'lodash';

  export default {
    components: {
      AdditionalDisk
    },

    data () {
      return {
        additionalDiskCount: 0,
        additionalDisks: []
      }
    },

    computed: {
      product() {
        return this.$store.state.currentProduct
      },
    },

    methods: {
      addDisk: function() {
        let newDisk = {
          key: this.additionalDiskCount,
          id: this.additionalDiskCount,
          type: 'standart',
          diskSize: 10,
          diskSpeed: 1000
        };

        this.additionalDisks.push(newDisk);
        this.additionalDiskCount++;
      },

      removeDisk: function(diskId) {
        let newArray = _.filter(this.additionalDisks, function(disk) {
          return disk.id !== diskId;
        });

        this.additionalDisks = newArray;
      },

      changeAdditionalDiskSize: function(index, value) {
        let diskIndex = _.findIndex(this.additionalDisks, function(disk) {
          return disk.id === index;
        });

        this.additionalDisks[diskIndex].diskSize = value;
      },

      changeAdditionalDiskSpeed: function(index, value) {
        let diskIndex = _.findIndex(this.additionalDisks, function(disk) {
          return disk.id === index;
        });

        this.additionalDisks[diskIndex].diskSpeed = value;
      },

      changeAdditionalDiskType: function(index, value) {
        let diskIndex = _.findIndex(this.additionalDisks, function(disk) {
          return disk.id === index;
        });

        this.additionalDisks[diskIndex].type = value;
      },
    }
  }

</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .product-page-content {

  }
</style>
