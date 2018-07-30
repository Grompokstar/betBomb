<template>
  <v-container>
    <v-layout row class="mmt-3">
      <v-flex xs6 class="dd-flex" align-center justify-start>
        <div class="display-1 medium mmr-3">{{$t('tickets.myTickets')}}</div>
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
      <v-spacer></v-spacer>
      <v-flex class="text-xs-right">
        <div class="boodet-btn" @click="createTicketDialog = true">{{$t('tickets.newTicketBtn')}}</div>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-data-table
        :headers="headers"
        :items="tickets"
        :search="search"
        :loading="isLoadingTickets"
        :rows-per-page-items="rowPerPageItems"
        :pagination.sync="pagination"
        :no-data-text="$t('productInstancesTable.noData')"
        :rows-per-page-text="$t('tablesCommon.pagination.rowPerPage')"
        class="width-100 de-table mmt-4"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props">
          <tr :class="ticketStates[props.item.state_id]">
            <td>
              <span class="ticket-name link" @click="goToTicket(props.item)">{{ props.item.title || '—' }}</span>
            </td>
            <td>{{ props.item.id }}</td>
            <td class="text-xs-center">{{ new Date(props.item.created_at).toLocaleString($i18n.locale, {day:'numeric', month:'short', year:'numeric', hour:'numeric', minute:'numeric'}) }}</td>
            <td class="ticket-status">{{$t('tickets.statuses[' + props.item.state_id + ']')}}</td>
            <!--<td>
              <v-menu offset-y bottom>
                <div class="menu-activator blue-color" slot="activator">{{ $t('productInstancesTable.actions') }}</div>
                <ul class="menu-list">
                  <li>{{ $t('productInstancesTable.delete') }}</li>
                </ul>
              </v-menu>
            </td>-->
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

    <v-dialog v-model="createTicketDialog" max-width="670px">
      <div class="close-btn"
           @click.stop="createTicketDialog = !createTicketDialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
          <path class="cross" fill="none" fill-rule="evenodd" stroke="#FF3200" stroke-width="2" d="M5.5 5.5L10 10 5.5 5.5 1 10l4.5-4.5zm0 0L1 1l4.5 4.5L10 1 5.5 5.5z"/>
        </svg>
      </div>
      <div class="dialog-title mmb-5">
        {{$t('tickets.newTicket')}}
      </div>

      <div>
        <v-form v-model="validCreateTicketForm" ref="form">
          <v-text-field
            type="text"
            :label="$t('tickets.subject')"
            class="mmt-3"
            v-model="createTicketForm.title"
            :rules="requireRules"
            required
          ></v-text-field>
          <v-textarea
            class="mmt-2"
            :label="$t('tickets.problem')"
            auto-grow
            v-model="createTicketForm.article.body"
            :rules="requireRules"
            required
          ></v-textarea>
        </v-form>
      </div>



      <div class="width-270 mmt-3 text-xs-center" v-if="createTicketPreloader">
        <img width=45px height=45px src="~assets/images/preloader.svg">
      </div>

      <div class="text-xs-center" v-else>
        <button  class="boodet-btn width-270 mmt-4"
                 @click="createTicket"
                 :disabled="!validCreateTicketForm">{{ $t('tickets.send') }}</button>
      </div>

    </v-dialog>
  </v-container>
</template>


<script>
  import axios from 'axios'
  import _ from 'lodash'
  import { makeErrorObject, calculatePrice } from '../../libraries/helpers'
  import { validationFunctions } from '../../libraries/validation_functions';

  export default {
    created() {
      this.$store.dispatch('getUserProfile')
        .then(() => {
          this.$store.dispatch('getZammadUser', this.$store.state.user.email).then(response => {
            if (response.status === 200) {
              if (response.data.length === 0) {
                let userData = {
                  email: this.$store.state.user.email,
                  firstname: this.$store.state.user.first_name,
                  lastname: this.$store.state.user.last_name,
                  password: 'boodet_online'
                }

                this.$store.dispatch('createZammadUser', userData).then(response2 => {
                  if (response2.status === 201) {
                    this.$store.commit('setZammadUser', response2.data);

                    this.$store.dispatch('getTickets', this.$store.state.zammadUser.id).then(response3 => {
                      if (response3.status === 200) {
                        this.isLoadingTickets = false;
                        this.$store.commit('setTickets', response3.data)

                      } else {
                        this.$toast.error(makeErrorObject(response3))
                      }
                    });

                  } else {
                    this.$toast.error(makeErrorObject(response2))
                  }
                });
              } else {
                this.$store.commit('setZammadUser', response.data[0]);

                this.$store.dispatch('getTickets', this.$store.state.zammadUser.id).then(response3 => {
                  if (response3.status === 200) {
                    this.isLoadingTickets = false;
                    this.$store.commit('setTickets', response3.data)

                  } else {
                    this.$toast.error(makeErrorObject(response3))
                  }
                });
              }

            } else {
              this.$toast.error(makeErrorObject(response))
            }
          });
        })
    },
    mounted() {
      $('input[required], textarea[required]').prev().addClass('require');

      this.timeoutId = setTimeout(function getTickets() {
        this.$store.dispatch('getTickets', this.$store.state.zammadUser.id).then(response => {
          if (response.status === 200) {
            this.$store.commit('setTickets', response.data)
          }
        });

        this.timeoutId = setTimeout(getTickets.bind(this), 30000)
      }.bind(this), 30000)
    },

    data () {
      return {
        createTicketDialog: false,
        validCreateTicketForm: false,
        createTicketPreloader: false,
        search: '',
        isShowSearchInput: false,
        isLoadingTickets: true,
        headers: [
          { text: this.$t('tickets.THs.title'), align: 'left', value: 'title'},
          { text: 'ID', align: 'left',  value: 'id'},
          { text: this.$t('tickets.THs.created'), align: 'center', value: 'create_at' },
          { text: this.$t('tickets.THs.status'), align: 'left', value: 'state_id' },
        ],
        pagination: {'sortBy': 'created_at', 'descending': true, 'rowsPerPage': 25},
        ticketStates: {
          "1": 'new',
          "2": 'open',
          "3": 'pending_reminder',
          "4": 'closed',
          "5": 'merged',
          "6": 'removed',
          "7": 'pending_close',
        },
        priceFunction: calculatePrice,
        rowPerPageItems: [5, 10, 25, 50, {"text":this.$t('tablesCommon.pagination.all'),"value":-1}],
        confirmDeleteProductDialog: false,
        deletingProduct: null,
        haveProcessingProducts: false,
        createTicketForm: {
          title: '',
          group: 'Users',
          customer: '',
          article: {
            subject: '',
            body: '',
            type: 'note',
            internal: false
          }
        },
        requireRules: [
          validationFunctions.require.bind(this)
        ],
        timeoutId: null

      }
    },

    computed: {
      tickets() {
        return this.$store.state.tickets
      }
    },

    methods: {
      showSearchInput() {
        this.isShowSearchInput = true
      },

      goToTicket(ticket) {
        this.$store.commit('setTicket', ticket);
        this.$router.push({ path: '/tickets/' + ticket.id });
      },

      createTicket () {
        if (this.$refs.form.validate()) {
          this.createTicketPreloader = true;
          let requestData = Object.assign(this.createTicketForm, {customer: this.$store.state.user.email});

          this.$store.dispatch('createTicket', requestData )
            .then(response => {
              if (response.status === 201) {
                setTimeout(function() {
                  this.createTicketPreloader = false;
                  this.createTicketDialog = false;
                  this.$toast.success({title: '', message: this.$t('tickets.notifications.createTicket')});
                  this.updateTicketsList();
                }.bind(this), 7000)

              } else {
                this.createTicketPreloader = false;
                this.createTicketDialog = false;
                this.$toast.error(makeErrorObject(response))
              }
            });

        }
      },

      updateTicketsList() {
        this.$store.dispatch('getTickets', this.$store.state.zammadUser.id).then(response => {
          if (response.status === 200) {
            this.isLoadingTickets = false;
            this.$store.commit('setTickets', response.data)
          } else {
            this.$toast.error(makeErrorObject(response));
          }
        });
      }
    },


    beforeDestroy() {
      clearTimeout(this.timeoutId)
    }

  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .search-icon {
    padding-top 13px
  }

  .ticket-name {
    font-size 18px
  }

  .ticket-status {
    font-weight 600!important
  }

  tr.new {
    .ticket-status {
      color orange !important
    }
  }

  tr.open {
    .ticket-status {
      color $red-brand-color !important
    }
  }

  tr.closed {
    .ticket-status {
      color $success-brand-color !important
    }
  }

  tr.pending_close, tr.pending_reminder {
    .ticket-status {
      color $font-color-gray !important
    }
  }

</style>
