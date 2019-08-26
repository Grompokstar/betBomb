<template>
  <v-container>
    <v-layout row class="mmt-2 mmb-5 align-center">
      <v-flex xs4>
        <v-autocomplete class="mmr-3"
                        :items="selectBot"
                        v-model="selectBotValue"
                        label="Боты"
                        multiple
                        hideDetails
                        autocomplete>
        </v-autocomplete>
      </v-flex>
      <v-flex xs2 class="mmr-3">
        <v-menu
                ref="menu"
                :close-on-content-click="false"
                v-model="menu"
                :nudge-right="40"
                :return-value.sync="dateAt"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
        >
          <v-text-field
                  slot="activator"
                  v-model="dateAt"
                  label="От"
                  prepend-icon="event"
                  hideDetails
                  readonly
          ></v-text-field>
          <v-date-picker v-model="dateAt" @input="$refs.menu.save(dateAt)"></v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs2 class="mmr-3">
        <v-menu
                ref="menu2"
                :close-on-content-click="false"
                v-model="menu2"
                :nudge-right="40"
                :return-value.sync="dateTo"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
        >
          <v-text-field
                  slot="activator"
                  v-model="dateTo"
                  label="До"
                  prepend-icon="event"
                  hideDetails
                  readonly
          ></v-text-field>
          <v-date-picker v-model="dateTo" @input="$refs.menu2.save(dateTo)"></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs1>
        <div class="boodet-btn mmt-2" @click="clearFilters">Очистить</div>
      </v-flex xs1>
      <v-flex>
        <div class="boodet-btn mmt-2" @click="refreshList">Применить</div>
      </v-flex>

    </v-layout>

    <v-layout row class="mmt-3">
      <v-flex xs10 class="dd-flex" align-center justify-start>
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
  
        <div class="mml-2 text-xs-center">
          Максимальная просадка<br> <span class="bold">{{maxSlump}} %</span>
        </div>

        <!--<div class="mml-2 text-xs-center">
          Гол до 60 м.<br> <span class="bold green&#45;&#45;text">{{ _60MinutePlusCount }}</span>
        </div>
        <div class="mml-2 text-xs-center">
          Гол до 60 м.<br> <span class="bold">{{(_60MinutePlusCount/eventsMinusCount*100).toFixed(2) }} %</span>
        </div>-->
      </v-flex>
      <v-spacer></v-spacer>
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
              <template v-if="props.item.odds.currentResultOdd">
              Исход: {{ props.item.odds.startResultOdd.home_od }}-{{ props.item.odds.startResultOdd.draw_od }}-{{ props.item.odds.startResultOdd.away_od }}  =>
              {{ props.item.odds.currentResultOdd.home_od }}-{{ props.item.odds.currentResultOdd.draw_od }}-{{ props.item.odds.currentResultOdd.away_od }}<br>
              </template>
              <template v-if="props.item.odds['1_8'] && props.item.odds['1_8']['0']">
                Исход 1 тайма: {{ props.item.odds['1_8']['0'].home_od }} - {{ props.item.odds['1_8']['0'].draw_od }} - {{ props.item.odds['1_8']['0'].away_od }}<br>
              </template>
              <template>
                ТБ: {{ tbCommon(props.item) }}<br>
                TБ 1 тайм: {{ tb1stHalf(props.item) }}<br>
                TM 1 тайм: {{ tm1stHalf(props.item) }}
              </template>
            </td>
            <td>
              <div v-if="props.item.botType">
                {{props.item.botType}}
              </div>
              <div v-if="props.item.resultView && props.item.resultView.scores && props.item.resultView.scores['1']" class="bold">
                {{ props.item.resultView.scores['2'].home }} - {{ props.item.resultView.scores['2'].away }}
                ({{ props.item.resultView.scores['1'].home }} - {{ props.item.resultView.scores['1'].away }})
              </div>
              <div v-if="props.item.resultView && props.item.resultView.events" >{{ GoalTimes(props.item.resultView.events) }}</div>
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

  export default {
    components: {
      BetsChart
    },

    mounted() {
      this.$store.dispatch('getEvents', {multi: this.selectBotValue}).then(response => {
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
        startBank: 15000,
        betSize: 1/50,
        betSize2: 1/50,
        chartOptions: {
          responsive: true,
          lineTension: 0,
        },
        chartData: {
          labels: [],
          datasets: [
            {
              label: 'Размер банка',
              backgroundColor: '#1532f8',
              data: []
            }
          ]
        },
        dateAt: '',
        dateTo: '',
        menu: false,
        menu2: false,
        selectBotValue: [{name: 'oracle', type: 'away'}],
        selectBot: [
          {value: {name: 'serega_draw', type: 'draw'}, text: 'Бот 0-0'},
          {value: {name: 'serega_draw_full', type: 'draw'}, text: 'Бот 0-0 Full'},
          {value: {name: 'oracle', type: 'away'}, text: 'Бот Оракул'},
          {value: {name: 'patriot', type: 'home'}, text: 'Бот Патриот'},
          {value: {name: 'friendship', type: 'draw'}, text: 'Бот Дружба'},
        ],
        multi: [
          //{name: 'serega_draw', type: 'draw'},
          //{name: 'serega_draw_full', type: 'draw'},
          {name: 'oracle', type: 'away'},
          {name: 'patriot', type: 'home'},
          //{name: 'friendship', type: 'draw'}
        ]

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
      maxSlump() {
        let result = 0;
        let currentMax = this.startBank;
        let maxDifferent = 0
        
        if (this.chartData.datasets[0].data.length > 0) {
          _.forEach(this.chartData.datasets[0].data, (dataItem) => {
            if (dataItem > currentMax) {
              currentMax = dataItem
            }
            
            if (currentMax - dataItem > maxDifferent) {
              maxDifferent = currentMax - dataItem
            }
          })
        }
        
        result = maxDifferent/this.startBank * 100
        return result.toFixed(2)
        
      },
      eventsMinusCount: resultFunctions['minus'],
      eventsPlusCount: resultFunctions['plus'],
      finalSum: resultFunctions['finalSum']
    },

    methods: {
      getResult: resultFunctions['resultClass'],

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
        if (item.odds && item.odds.startTbOdd) {
          return item.odds.startTbOdd.over_od + '/' + item.odds.startTbOdd.handicap
        }
      },

      refreshList() {
        this.isLoadingProducts = true;

        let filter = {
          date_at: this.dateAt,
          date_to: this.dateTo,
          multi: this.selectBotValue
        }
        this.$store.dispatch('getEvents', filter).then(response => {
          this.isLoadingProducts = false;
          if (response.status === 200) {
            this.$store.commit('setEvents', response)
          } else {
            this.$toast.error(makeErrorObject(response))
          }
        });
      },

      clearFilters() {
        this.dateAt = ''
        this.dateTo = ''
      },

      GoalTimes(events) {
        if (events) {
          let goalEvents = [];
          let goalTimes = [];

          _.forEach(events, function(event) {
            if (event.text && event.text.indexOf(' Goal ') >=0 ) {
              goalEvents.push(event.text)
            };
          });

          _.forEach(goalEvents, function(event) {
            goalTimes.push(event.substring(0, event.indexOf('\'')));
          })

          return goalTimes;
        } else {
          return '-'
        }

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
