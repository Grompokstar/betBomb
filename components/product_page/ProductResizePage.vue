<template>
  <div class="product-page-content">
    <div class="product-price">{{ totalPrice }}&nbsp;&#8381;</div>
    <div class="page-title">
      {{ $t('productPage.resizeTitle') }}
    </div>
    <div class="page-description mmb-4">
      {{ $t('productPage.resizeDescription') }}
    </div>

    <v-layout class="mmb-1">
      <v-flex md5 class="slider-form-group without-label mmt-3">
        <v-text-field
          v-model="computedCPU"
          label="CPU"
          disabled
        ></v-text-field>
        <v-slider v-model="sliderCPUValue" max="9" @input="changeCPU"></v-slider>
      </v-flex>
    </v-layout>

    <v-layout class="mmb-1">
      <v-flex md5 class="slider-form-group without-label mmt-3">
        <v-text-field
          v-model="computedRAM"
          label="RAM"
          disabled
        ></v-text-field>
        <v-slider v-model="sliderRAMValue" max="13" @input="changeRAM"></v-slider>
      </v-flex>
    </v-layout>

    <!--<v-layout>
      <v-flex md5 class="slider-form-group without-label mmt-3 mmb-2">
        <v-text-field
          v-model="computedBootDisk"
          label="Размер основного диска"
          disabled
        ></v-text-field>
        <v-slider v-model="sliderBootDiskValue" :min="0" max="11"></v-slider>
      </v-flex>
    </v-layout>-->

    <div class="width-170 mmr-4 text-xs-center" v-if="resizeMachinePreloader">
      <img width=45px height=45px src="~assets/images/preloader.svg">
    </div>
    <template v-else>
      <button class="boodet-btn width-170 mmr-4" :disabled="checkResizeAvailable" @click="saveResize">{{ $t('button.save') }}</button>
      <span class="page-description" v-if="checkResizeAvailable">{{ $t('productPage.makeResizeAttention') }}</span>
    </template>

  </div>
</template>

<script>
  export default {
    mounted() {
      this.sliderCPUValue = this.cpuArray.indexOf(this.product.machine.vcpus);
      this.sliderRAMValue = this.ramArray.indexOf(this.product.machine.memory === 512 ? 512 : this.product.machine.memory/1024);

      this.$store.dispatch('getProduct', this.$route.params.id).then(response => {
        this.$store.commit('setProduct', response.product_instance);
        setTimeout(function() {
          this.sliderCPUValue = this.cpuArray.indexOf(this.$store.state.currentProduct.machine.vcpus);
          this.sliderRAMValue = this.ramArray.indexOf(this.$store.state.currentProduct.machine.memory === 512 ? 512 : this.$store.state.currentProduct.machine.memory/1024);
         /* this.sliderBootDiskValue = this.bootDiskArray.indexOf(this.$store.state.currentProduct.machine.boot_disk_size);
          this.sliderBandwidthValue = this.bandwidthArray.indexOf(this.$store.state.currentProduct.machine.bandwidth);
          this.externalIpValue = this.$store.state.currentProduct.machine.external_ip;
          this.backup = this.$store.state.currentProduct.machine.sessions;
          this.additionalDisks = this.$store.state.currentProduct.machine.additional_disks;*/
        }.bind(this), 100)
      })
    },
    props: ['product'],
    data () {
      return {
        cpuArray: [1, 2, 4, 6, 8, 12, 16, 24, 32, 48],
        ramArray: [512, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 224],
        bootDiskArray: [10, 20, 40, 60, 80, 100, 200, 500, 750, 1000, 1500, 2000],
        sliderCPUValue: 0,
        sliderRAMValue: 1,
        sliderBootDiskValue: 0,
        selectTimeRange: [
          {
            text: '30 дней',
            value: '30'
          },
          {
            text: '60 дней',
            value: '60'
          },
          {
            text: '90 дней',
            value: '90'
          }
        ],
        selectTimeRangeValue: '30',
        bandwidthArray: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        sliderBandwidthValue: 0,
        externalIpValue: false,
        backup: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false
        },
        additionalDisks: [],
        resizeMachinePreloader: false
      }
    },

    computed: {
      /*product() {
        return this.$store.state.currentProduct
      },*/

      computedCPU: function() {
        return this.cpuArray[this.sliderCPUValue];
      },
      computedRAM: function() {
        if (this.sliderRAMValue === 0 ) {
          return this.ramArray[this.sliderRAMValue] + ' MB';
        } else {
          return this.ramArray[this.sliderRAMValue] + ' GB';
        }
      },
      isConfigBackup: function() {
        let result = false;

        for (let key in this.backup) {
          if (this.backup[key]) {
            result = true;
          }
        }

        return result;
      },
      checkResizeAvailable() {
        let initCPU = this.cpuArray.indexOf(this.$store.state.currentProduct.machine.vcpus);
        let initRAM = this.ramArray.indexOf(this.$store.state.currentProduct.machine.memory === 512 ? 512 : this.$store.state.currentProduct.machine.memory/1024);

        let status = this.$store.state.currentProduct.machine.status;

        if (status !== 'RUNNING' || (this.sliderCPUValue >= initCPU && this.sliderRAMValue >= initRAM)) {
          return false
        } else {
          return true
        }
      },

      computedBootDisk: function() {
        return this.bootDiskArray[this.sliderBootDiskValue] + ' GB';
      },
      totalPrice: function () {
        let price = 0;

        price = this.cpuArray[this.sliderCPUValue] * 280 + this.bootDiskArray[this.sliderBootDiskValue] * 5.74;

        if (this.sliderRAMValue === 0) {
          price += 0.5 * 210;
        } else {
          price += this.ramArray[this.sliderRAMValue] * 210;
        }

        if (this.sliderBandwidthValue >= 0) {
          price += (this.bandwidthArray[this.sliderBandwidthValue] - 10) * 7.5;
        }

        /*if (this.selectOsValue === 11) {
          if (this.cpuArray[this.sliderCPUValue] <= 8) {
            price += 800;
          } else {
            price += 800 + Math.round((this.cpuArray[this.sliderCPUValue] - 8)/2)*350;
          }

        }

        if(this.externalIpValue) {
          price += 90;
        }

        let additionalDisksPrice = 0;

        if (this.additionalDisks && this.additionalDisks.length > 0) {
          this.additionalDisks.forEach(function(disk) {
            if (disk.type === 'standart') {
              additionalDisksPrice += disk.diskSize * 5.74;
            } else if (disk.type === 'archive') {
              additionalDisksPrice += disk.diskSize * 1.54;
            } else if (disk.type === 'custom') {
              additionalDisksPrice += (disk.diskSize * 7.39 + disk.diskSpeed * 3.87);
            }
          })
        }

        price += additionalDisksPrice;

        if (this.isConfigBackup) {
          let baseVMPrice = this.cpuArray[this.sliderCPUValue] * 280 +
            (this.ramArray[this.sliderRAMValue] === 512 ? 0.5 : this.ramArray[this.sliderRAMValue]) * 210 +
            this.bootDiskArray[this.sliderBootDiskValue] * 5.74 + additionalDisksPrice;
          price += baseVMPrice*0.3*(this.selectTimeRangeValue/30);
        }*/

        return Math.round(price).toLocaleString('ru-RU');
      }
    },

    methods: {
      changeCPU: function () {
        if (this.sliderCPUValue === 0) {
          if (this.sliderRAMValue !== 0) {
            this.sliderRAMValue = 0;
          }
        } else if (this.sliderCPUValue > 0 && this.sliderCPUValue <= 2) {
          if (this.sliderRAMValue < 1  || this.sliderRAMValue > 4) {
            this.sliderRAMValue = 1;
          }
        } else if (this.sliderCPUValue > 2 && this.sliderCPUValue <= 38) {
          if (this.ramArray[this.sliderRAMValue] !== this.cpuArray[this.sliderCPUValue]*2) {
            this.sliderRAMValue = this.ramArray.indexOf(this.cpuArray[this.sliderCPUValue]*2)
          }
        } else if (this.sliderCPUValue > 8) {
          if (this.sliderRAMValue < 11) {
            this.sliderRAMValue = 11;
          }
        }
      },

      changeRAM: function () {
        if (this.sliderRAMValue === 0) {
          if (this.sliderCPUValue !== 0) {
            this.sliderCPUValue = 0;
          }
        } else if (this.sliderRAMValue <= 4) {
          if (this.sliderCPUValue > 2) {
            this.sliderCPUValue = 1;
          }
        } else if (this.sliderRAMValue > 4 && this.sliderRAMValue <= 10) {
          if (this.cpuArray[this.sliderCPUValue] !== this.ramArray[this.sliderRAMValue]/2) {
            this.sliderCPUValue = this.cpuArray.indexOf(this.ramArray[this.sliderRAMValue]/2)
          }
        } else if (this.sliderRAMValue > 10) {
          if (this.sliderCPUValue < 9) {
            this.sliderCPUValue = 9;
          }
        }
      },

      saveResize() {
        this.resizeMachinePreloader = true;

        let requestProductParams = Object.assign({}, this.product.machine, {
          vcpus: this.cpuArray[this.sliderCPUValue],
          memory: (this.ramArray[this.sliderRAMValue] === 512 ? 512 : this.ramArray[this.sliderRAMValue] * 1024)
        });
        let requestData = {
          product_id: this.product.id,
          product_instance: {
            action_name: 'resize',
            action_params: requestProductParams
          }
        };

        this.$store.dispatch('productInstanceResize', requestData).then(response => {
          if (response.status === 201) {
            this.$store.dispatch('getProducts').then(response => {
              this.resizeMachinePreloader = false;
              if (response.status === 200) {
                this.isLoadingProducts = false;
                let filteredData = _.filter(response.data.product_instances, function(item) {
                  return item.state !== 'deleted';
                });

                let mapedResponse = filteredData.map(function(product) {
                  product.created_at = product.created_at;
                  product.client_name = this.$store.state.client.name;
                  product.machine = _.find(product.resources, function(item) {
                    return item.type === 'machine'
                  })

                  return product;
                }.bind(this))
                this.$store.commit('setProducts', mapedResponse);

                this.$toast.success({title: '', message: this.$t('productPage.notifications.resizeVM')});
                this.$router.push({ path: '/products' })
              } else {
                this.$toast.error(makeErrorObject(response))
              }
            });
          } else {
            this.resizeMachinePreloader = false;
            this.$toast.error(makeErrorObject(response))
          }
        })
      }
    }
  }

</script>

<style lang="stylus">

</style>
