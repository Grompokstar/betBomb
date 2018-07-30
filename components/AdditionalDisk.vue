<template>
  <div>
    <div class="additional-disk-container">
      <div class="divider-40 mmy-2">
        #{{ diskIndex + 1 }}
        <span @click="$emit('removeDisk', diskIndex)" class="remove-additional-disk red-link">Удалить</span>
      </div>
      <v-layout class="mmb-2">
        <v-flex>
          <div class="font-sm mmb-2">Тип диска</div>

          <v-radio-group
            v-model="diskTypeValue"
            :column="false"
            @change="$emit('changeDiskType', diskIndex, diskTypeValue)"
            class="mmb-2">
            <v-radio
              label="Стандартный"
              value="standart">
            </v-radio>
            <v-radio
              label="Архивный"
              value="archive">
            </v-radio>
            <v-radio
              label="Настраиваемый"
              value="custom">
            </v-radio>
          </v-radio-group>
        </v-flex>
      </v-layout>

      <v-layout class="mmb-3">
        <v-flex class="slider-form-group without-label">
          <v-text-field
            :value="diskSizeValue"
            label="Размер диска, GB"
            @change="setDiskSizeValue">
          </v-text-field>
          <v-slider v-model="diskSizeValue"   :min="minDiskSize" max="16000" step="10"
                    @input="$emit('changeDiskSize', diskIndex, diskSizeValue)">
          </v-slider>
        </v-flex>
      </v-layout>

      <v-layout v-if="diskTypeValue === 'custom'">
        <v-flex class="slider-form-group without-label">
          <v-text-field
            :value="diskSpeedValue"
            label="Скорость диска, IOPS"
            @change="setDiskSpeedValue">
          </v-text-field>
          <v-slider v-model="diskSpeedValue" min="1000" max="15000" step="100"
                    @input="$emit('changeDiskSpeed', diskIndex, diskSpeedValue)">
          </v-slider>
        </v-flex>
      </v-layout>
    </div>
    <!--<div class="additional-disk-container" v-if="!productPage">
      <div class="divider-40 mmy-2">
        #{{ diskIndex + 1 }}
      </div>
      <v-layout>
        <v-flex md4 text-xs-right class="ppr-2">Тип диска</v-flex>
        <v-flex md4>

          <v-radio-group
            v-model="diskTypeValue"
            @change="$emit('changeDiskType', diskIndex, diskTypeValue)"
            class="mmb-3">
            <v-radio
              label="Стандартный"
              value="standart">
            </v-radio>
            <v-radio
              label="Архивный"
              value="archive">
            </v-radio>
            <v-radio
              label="Настраиваемый"
              value="custom">
            </v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex md-4 text-xs-right>
          <span @click="$emit('removeDisk', diskIndex)" class="remove-additional-disk red-link">Удалить</span>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex md4 text-xs-right class="ppt-1 ppr-2">Размер диска, GB</v-flex>
        <v-flex md4 class="slider-form-group without-label">
          <v-text-field
            :value="diskSizeValue"
            @change="setDiskSizeValue">
          </v-text-field>
          <v-slider v-model="diskSizeValue"   :min="minDiskSize" max="16000" step="10"
                    @input="$emit('changeDiskSize', diskIndex, diskSizeValue)">
          </v-slider>
        </v-flex>
      </v-layout>

      <v-layout v-if="diskTypeValue === 'custom'">
        <v-flex md4 text-xs-right class="ppt-1 ppr-2">Скорость диска, IOPS</v-flex>
        <v-flex md4 class="slider-form-group without-label">
          <v-text-field
            :value="diskSpeedValue"
            @change="setDiskSpeedValue">
          </v-text-field>
          <v-slider v-model="diskSpeedValue" min="1000" max="15000" step="100"
                    @input="$emit('changeDiskSpeed', diskIndex, diskSpeedValue)">
          </v-slider>
        </v-flex>
      </v-layout>
    </div>-->
  </div>

</template>

<script>
  export default {
    props: ['productPage', 'boodetConfig', 'diskIndex', 'diskType', 'sliderDiskSizeValue', 'sliderDiskSpeedValue'],

    data() {
      return {
        diskSizeValue: this.sliderDiskSizeValue,
        diskTypeValue: this.diskType,
        diskSpeedValue: this.sliderDiskSpeedValue
      }
    },

    computed: {
      inputName: function() {
        return 'disk-type' + this.diskIndex;
      },

      inputStandartId: function() {
        return 'disk-standart' + this.diskIndex;
      },
      inputArchiveId: function() {
        return 'disk-archive' + this.diskIndex;
      },
      inputCustomId: function() {
        return 'disk-custom' + this.diskIndex;
      },
      computedDiskSize: function() {
        return this.diskSizeValue + ' GB'
      },
      computedDiskSpeed: function() {
        return this.diskSpeedValue + ' IOPS'
      },
      minDiskSize: function() {
        if (this.diskTypeValue === 'archive') {
          return 200;
        } else if (this.diskTypeValue === 'custom') {
          return Math.round(this.diskSpeedValue/100);
        } else {
          return 10;
        }
      },
    },

    methods: {
      setDiskSizeValue: function(e) {
        this.diskSizeValue = e.target.value;
      },

      setDiskSpeedValue: function(e) {
        this.diskSpeedValue = e.target.value;
      }
    },

    mounted() {

      $('.slider-input-control').on('keydown', function(event) {
        var $input = $(this);

        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
          // Разрешаем: Ctrl+A
          (event.keyCode == 65 && event.ctrlKey === true) ||
          // Разрешаем: home, end, влево, вправо
          (event.keyCode >= 35 && event.keyCode <= 39)) {
          // Ничего не делаем
        }
        else {
          // Обеждаемся, что это цифра, и останавливаем событие keypress
          if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
            event.preventDefault();

          }
        }
      });
    }
  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .choose-disk-type {
    div {
      margin-bottom: 10px;
    }
  }

  .remove-additional-disk {
    display: block;
    cursor: pointer;
    color: $red-brand-color;
    font-size: 14px;
    font-weight 400
    line-height: 1;
    top: 11px;
    right 15px
    margin-left: 10px;
    position absolute
  }

  .price-measure {
    font-weight: bold;
    font-size: 20px;
  }

</style>
