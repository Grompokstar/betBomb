<template>
  <v-container>
    <!--<v-layout>
      <v-flex class="mml-3">
        Период тестирования:
        <b>{{ new Date(parseInt(startPeriod) * 1000).toLocaleString('ru', {day:'numeric', month:'short', year:'numeric'}) }}  -
        {{ new Date(parseInt(endPeriod) * 1000).toLocaleString('ru', {day:'numeric', month:'short', year:'numeric'}) }}</b>
      </v-flex>
    </v-layout>-->
    <v-layout row class="mmt-2">
      <v-flex xs10 class="dd-flex" align-center justify-start>
        <!--<div class="display-1 medium mmr-3">События</div>
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
        ></v-text-field>-->
        <div class="mml-3 text-xs-center">
          Всего матчей<br> <span class="bold">{{ eventsCount }}</span>
        </div>
        <div class="mml-2 text-xs-center">
          Не рассчитано<br> <span class="bold">{{ eventsCount - (eventsPlusCount+eventsMinusCount) }}</span>
        </div>
        <div class="mml-2 text-xs-center">
          Плюсов<br> <span class="bold green--text">{{ eventsPlusCount }}</span>
        </div>
        <div class="mml-2 text-xs-center">
          Минусов<br> <span class="bold red--text">{{ eventsMinusCount }}</span>
        </div>

        <div class="mml-2 text-xs-center">
          Процент прохода<br> <span class="bold">{{ (eventsPlusCount/(eventsPlusCount+eventsMinusCount)*100).toFixed(2) }} %</span>
        </div>
        <div class="mml-2 text-xs-center">
          Начальный банк<br> <span class="bold">{{ startBank }}</span>
        </div>
        <div class="mml-2 text-xs-center">
          Размер 1 ставки<br> <span class="bold">{{ startBank*betSize }}</span>
        </div>


        <div class="mml-2 text-xs-center">
          Итоговый банк<br> <span class="bold">{{ finalSum.toFixed(0) }}</span>
        </div>

        <div class="mml-2 text-xs-center">
          Прирост банка<br> <span class="bold">{{ ((finalSum.toFixed(0)-startBank)/startBank*100).toFixed(2) }} %</span>
        </div>

        <div class="mml-2 text-xs-center">
          Профитность оборота ставок<br> <span class="bold">{{ ((finalSum.toFixed(0)-startBank)/((eventsPlusCount + eventsMinusCount)*(startBank*betSize)) * 100).toFixed(2) }} %</span>
        </div>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex class="text-xs-right">
        <div class="boodet-btn" @click="refreshList">Обновить</div>
      </v-flex>
    </v-layout>
    <div class="chart-container mmt-2">
      <bets-chart :chartData="chartData" :options="chartOptions"></bets-chart>
    </div>

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
          <tr class="pointer" :class="getResult(props.item)">
            <td>
              {{props.item.id}}<br>
              {{ new Date(parseInt(props.item.time) * 1000).toLocaleString('ru') }}
            </td>
            <td>
              {{props.item.league.name}}<br>
              <div class="bold sans-pro">{{props.item.home.name}} <span class="font-lg red-brand-color">{{props.item.ss}}</span> {{props.item.away.name}}</div>
              <b>{{ props.item.timer.tm }}</b> минута
            </td>
            <td>
              <template v-if="props.item.view.stats.attacks">
                Атаки: {{props.item.view.stats.attacks[0]}} - {{props.item.view.stats.attacks[1]}}<br>
                Опасные: {{props.item.view.stats.dangerous_attacks[0]}} - {{props.item.view.stats.dangerous_attacks[1]}}<br>
              </template>
              <template v-if="props.item.homeDangerAttacks">
                Опасные атаки: {{props.item.homeDangerAttacks}} - {{props.item.awayDangerAttacks}}<br>
              </template>
            </td>
            <td>
              <template v-if="props.item.view.stats.on_target && props.item.view.stats.off_target">
                В створ: {{props.item.view.stats.on_target[0]}} - {{props.item.view.stats.on_target[1]}}<br>
                Мимо: {{props.item.view.stats.off_target[0]}} - {{props.item.view.stats.off_target[1]}}
              </template>
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
              <template v-if="props.item.odds['1_1'] && props.item.odds['1_8'] && props.item.odds['1_8']['0']">
              Исход: {{ props.item.odds['1_1'][props.item.odds['1_1'].length - 1].home_od }} - {{ props.item.odds['1_1'][props.item.odds['1_1'].length - 1].away_od }}  =>
              {{ props.item.odds['1_1']['0'].home_od }} - {{ props.item.odds['1_1']['0'].away_od }}<br>
              Исход 1 тайма: {{ props.item.odds['1_8']['0'].home_od }} - {{ props.item.odds['1_8']['0'].draw_od }} - {{ props.item.odds['1_8']['0'].away_od }}<br>
              </template>
              <template>
                ТБ: {{ tbCommon(props.item) }}<br>
                TБ 1 тайм: {{ tb1stHalf(props.item) }}<br>
                TM 1 тайм: {{ tm1stHalf(props.item) }}
              </template>
            </td>
            <td>
              <div v-if="props.item.resultView && props.item.resultView.scores && props.item.resultView.scores['1']" class="bold">
                {{ props.item.resultView.scores['2'].home }} - {{ props.item.resultView.scores['2'].away }}
                ({{ props.item.resultView.scores['1'].home }} - {{ props.item.resultView.scores['1'].away }})
              </div>
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
  import { resultFunctions } from '../../libraries/result_functions'
  import BetsChart from '~/components/charts/BetsChart'
  const resultType = 'winner'

  export default {
    components: {
      BetsChart
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
    },

    data() {
      return {
        search: '',
        isShowSearchInput: false,
        isLoadingProducts: true,
        headers: [
          {text: 'ID, время', align: 'left', value: 'time'},
          {text: 'Лига, команды', align: 'left', value: 'league.name'},
          {text: 'Атаки', align: 'left', sortable: false },
          {text: 'Удары', align: 'left', sortable: false},
          {text: 'Карточки', sortable: false },
          {text: 'Другое', align: 'left', sortable: false},
          {text: 'Ставки', sortable: false},
          {text: 'Итоговый счет', sortable: false}
        ],
        pagination: {'sortBy': 'time', 'rowsPerPage': 50},
        machineStatuses: {
          RUNNING: this.$t('productStatuses.running'),
          HALTED: this.$t('productStatuses.halted'),
          active: this.$t('productStatuses.active'),
          processing: this.$t('productStatuses.processing'),
          failed: this.$t('productStatuses.failed'),
        },
        rowPerPageItems: [5, 10, 25, 50, {"text": this.$t('tablesCommon.pagination.all'), "value": -1}],
        confirmDeleteProductDialog: false,
        deletingProduct: null,
        haveProcessingProducts: false,
        startBank: 10000,
        betSize: 0.05,
        chartOptions: {
          responsive: true
        },
        chartData: {
          labels: [],
          datasets: [
            {
              label: 'Размер банка',
              backgroundColor: '#f87979',
              data: []
            }
          ]
        }

      }
    },

    computed: {
      events() {
        return this.$store.state.events
      },
      startPeriod() {
        //return this.$store.state.events[0].time
      },
      endPeriod() {
        //return this.$store.state.events[this.$store.state.events.length - 1].time
      },
      eventsCount() {
        return this.$store.state.events.length
      },
      eventsMinusCount: resultFunctions[resultType + 'Minus'],
      eventsPlusCount: resultFunctions[resultType + 'Plus'],
      finalSum: resultFunctions[resultType + 'FinalSum']
    },

    methods: {
      getResult: resultFunctions[resultType + 'Class'],

      showSearchInput() {
        this.isShowSearchInput = true
      },

      goToProductInstance(product) {
        let machine = _.find(product.resources, function (resource) {
          return resource.type === 'machine'
        });

        if (product.state === 'active' && machine) {
          this.$store.commit('setProduct', product);
          this.$router.push({path: '/products/' + product.id});
        }
      },

      tb1stHalf(item) {
        if (item.odds && item.odds['1_6'] && item.odds['1_6']['0']) {
          return item.odds['1_6']['0'].over_od + '/' + item.odds['1_6']['0'].handicap
        }
      },

      tm1stHalf(item) {
        if (item.odds && item.odds['1_6'] && item.odds['1_6']['0']) {
          return item.odds['1_6']['0'].under_od + '/' + item.odds['1_6']['0'].handicap
        }
      },

      tbCommon(item) {
        if (item.odds && item.odds['1_3'] && item.odds['1_3'].length >= 1) {
          return item.odds['1_3'][item.odds['1_3'].length - 1].over_od + '/' + item.odds['1_3'][item.odds['1_3'].length - 1].handicap
        }
      },

      refreshList() {
        this.isLoadingProducts = true;
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

  .chart-container {
    #line-chart {
      max-height 650px
    }
  }

</style>
