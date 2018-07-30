<template>
  <v-container>
    <v-layout row class="mmt-3">
      <v-flex xs6 class="dd-flex" align-center justify-start>
        <div class="display-1 medium mmr-3">События</div>
        <div class="search-icon d-block" v-if="!isShowSearchInput">
          <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" @click="showSearchInput">
            <g fill="none" fill-rule="evenodd" stroke="#FF3200" stroke-width="2" transform="matrix(-1 0 0 1 18 1)">
              <path stroke-linecap="round" d="M13 13l4 4"/>
              <circle cx="7.5" cy="7.5" r="7.5"/>
            </g>
          </svg>
        </div>

        <v-text-field v-if="isShowSearchInput"
                      v-model="search"
                      pt-0
                      class="without-details"
        ></v-text-field>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-data-table
        :headers="headers"
        :items="events"
        :search="search"
        :loading="isLoadingProducts"
        :rows-per-page-items="rowPerPageItems"
        :pagination.sync="pagination"
        :no-data-text="$t('productInstancesTable.noData')"
        :rows-per-page-text="$t('tablesCommon.pagination.rowPerPage')"
        class="width-100 de-table mmt-4"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr>
            <td>
              {{props.item.league.name}}<br>
              <div class="bold sans-pro">{{props.item.home.name}} <span class="font-lg blue-brand-color">{{props.item.ss}}</span> {{props.item.away.name}}</div>
              <b>{{ props.item.timer.tm }}</b> минута
            </td>
            <td>
              Атаки: {{props.item.view.stats.attacks[0]}} - {{props.item.view.stats.attacks[1]}}<br>
              Опасные: {{props.item.view.stats.dangerous_attacks[0]}} - {{props.item.view.stats.dangerous_attacks[1]}}
            </td>
            <td>
              В створ: {{props.item.view.stats.goals[0]}} - {{props.item.view.stats.goals[1]}}<br>
              Мимо: {{props.item.view.stats.off_target[0]}} - {{props.item.view.stats.off_target[1]}}
            </td>
            <td>
              Желтые: {{props.item.view.stats.yellowcards[0]}} - {{props.item.view.stats.yellowcards[1]}}<br>
              Красные: {{props.item.view.stats.redcards[0]}} - {{props.item.view.stats.redcards[1]}}
            </td>
            <td>
              Угловые: {{props.item.view.stats.corners[0]}} - {{props.item.view.stats.corners[1]}}<br>
              Пенальти: {{props.item.view.stats.penalties[0]}} - {{props.item.view.stats.penalties[1]}}<br>
              <span v-if="props.item.view.stats.possession_rt">
                Владение: {{props.item.view.stats.possession_rt[0]}} - {{props.item.view.stats.possession_rt[1]}}
              </span>
            </td>
            <td>
              Исход: {{ props.item.odds['1_1'][props.item.odds['1_1'].length - 1].home_od }} - {{ props.item.odds['1_1'][props.item.odds['1_1'].length - 1].away_od }}  =>
              {{ props.item.odds['1_1'][0].home_od }} - {{ props.item.odds['1_1'][0].away_od }}<br>
              <template v-if="props.item.odds['1_3']">
                ТБ: {{ props.item.odds['1_3'][props.item.odds['1_3'].length - 1].over_od }}/{{ props.item.odds['1_3'][props.item.odds['1_3'].length - 1].handicap }}<br>
                TБ 1 тайм: {{ props.item.odds['1_6'][0].over_od }}/{{ props.item.odds['1_6'][0].handicap }}
              </template>
            </td>
          </tr>
        </template>
        <div slot="no-results" :value="true">
          {{ $t('tablesCommon.find', {search: search})}}
        </div>
        <template slot="pageText" slot-scope="props">
          {{ props.pageStart }} - {{ props.pageStop }} {{ $t('tablesCommon.pagination.of') }} {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>


<script>
  import axios from 'axios'
  import _ from 'lodash'
  import { makeErrorObject, calculatePrice } from '../../libraries/helpers'

  export default {
    data () {
      return {
        search: '',
        isShowSearchInput: false,
        isLoadingProducts: true,
        headers: [
          { text: 'Лига, команды', align: 'left', sortable: false,value: 'id'},
          { text: 'Атаки', align: 'left',  sortable: false, value: 'product_id'},
          { text: 'Удары', align: 'left', sortable: false, value: '' },
          { text: 'Карточки', sortable: false, value: 'created_at' },
          { text: 'Другое', align: 'left', sortable: false, value: 'state'},
          { text: 'Ставки', sortable: false }
        ],
        pagination: {'sortBy': 'created_at', 'descending': true, 'rowsPerPage': 25},
        machineStatuses: {
          RUNNING: this.$t('productStatuses.running'),
          HALTED: this.$t('productStatuses.halted'),
          active: this.$t('productStatuses.active'),
          processing: this.$t('productStatuses.processing'),
          failed: this.$t('productStatuses.failed'),
        },
        rowPerPageItems: [5, 10, 25, 50, {"text":this.$t('tablesCommon.pagination.all'),"value":-1}],
        confirmDeleteProductDialog: false,
        deletingProduct: null,
        haveProcessingProducts: false

      }
    },

    computed: {
      events() {
        return this.$store.state.events
      }
    },

    methods: {
      showSearchInput() {
        this.isShowSearchInput = true
      },

      goToProductInstance(product) {
        let machine = _.find(product.resources, function(resource) {
          return resource.type === 'machine'
        });

        if (product.state === 'active' && machine) {
          this.$store.commit('setProduct', product);
          this.$router.push({ path: '/products/' + product.id });
        }
      }
    },

    mounted() {
      this.$store.dispatch('getEvents').then(response => {
        this.isLoadingProducts = false;
        if (response.status === 200) {
          this.$store.commit('setEvents', response)
        } else {
          this.$toast.error(makeErrorObject(response))
        }
      });
    }




  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .search-icon {
    padding-top 13px
  }

  .product-name {
    font-size 18px
  }

  .product-status {
    font-weight 600!important
  }

  tr.failed {
    .product-status {
      color $red-brand-color !important
    }
  }

  tr.active, tr.RUNNING {
    .product-status {
      color $success-brand-color !important
    }
  }

  tr.HALTED {
    .product-status {
      color orange !important
    }
  }

  tr.processing {
    opacity 0.25

    .product-status {
      font-weight 400!important
    }
  }

</style>
