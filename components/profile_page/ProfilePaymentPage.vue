<template>
  <div class="product-page-content">
    <div class="bold font-xl mmb-3">{{ $t('profilePage.balanceTitle') }}</div>

    <div class="mmb-4 balance-block">
      <span class="font-xxl bold">{{balance.toLocaleString('ru-RU')}}&nbsp;&#8381;</span>
      <span class="balance-label">{{ $t('profilePage.balanceLabel') }}</span>
    </div>
    <div class="payU-btn-row mmb-1">
      <button class="boodet-btn width-170 mmr-4" @click="showPaymentDialog = true">{{ $t('button.deposit') }}</button>
      <img height="44px" src="~assets/images/payU.png">
    </div>


    <div class="page-description mmb-4">
      {{ $t('profilePage.depositPayU') }}
    </div>
    <div class="font-xxl">{{ $t('profilePage.transactionHistory') }}</div>

    <v-data-table
      :headers="headers"
      :items="writeoffs"
      disable-initial-sort
      hide-actions
      class="width-100 de-table without-border mmt-2 mmb-4"
    >
      <template  slot="items" slot-scope="props">
        <tr>
          <td>{{new Date(props.item.writeoff_month).toLocaleString($i18n.locale, {day: '2-digit', month: '2-digit', year: '2-digit'}) }}</td>
          <td>
            <span @click="showWriteoffsDetailed(props.item.writeoff_month)" class="link font-lg">{{ $t('profilePage.statementFor') }} {{new Date(props.item.writeoff_month).toLocaleString($i18n.locale, {month:'long', year:'numeric'}) }}</span>
          </td>
          <td class="text-xs-right">{{ parseFloat(props.item.amount_sum).toFixed(2)}}</td>
        </tr>

      </template>
    </v-data-table>

    <v-dialog v-model="showStatementDialog" max-width="1200px">
      <div class="close-btn"
           @click.stop="showStatementDialog = !showStatementDialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
          <path class="cross" fill="none" fill-rule="evenodd" stroke="#FF3200" stroke-width="2" d="M5.5 5.5L10 10 5.5 5.5 1 10l4.5-4.5zm0 0L1 1l4.5 4.5L10 1 5.5 5.5z"/>
        </svg>
      </div>
      <div class="dialog-title mmb-2">
        {{ $t('profilePage.detailedStatement') }}
      </div>
      <v-data-table
        v-show="currentDate"
        :headers="headers2"
        :items="currentWriteoffs"
        :rows-per-page-items="rowPerPageItems"
        :loading="isLoadingWriteoffDetails"
        disable-initial-sort
        :no-data-text="$t('productInstancesTable.noData')"
        :rows-per-page-text="$t('tablesCommon.pagination.rowPerPage')"
        class="width-100 de-table without-border pointer mmt-2"
      >
        <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
        <template slot="items" slot-scope="props" >
          <tr :class="{'no-pointer': props.item.amount == 0}" @click="props.item.amount > 0 ? props.expanded = !props.expanded : ''">
            <td>{{ new Date(props.item.start_date).toLocaleString($i18n.locale) }} - {{ new Date(props.item.end_date).toLocaleString($i18n.locale) }}</td>
            <td class="text-xs-right">{{ parseFloat(props.item.amount).toFixed(2) }}</td>
          </tr>
        </template>

        <template slot="expand" slot-scope="props">
          <div class="de-table">
            <table class="table th-left">
              <thead>
                <th>{{ $t('profilePage.th.product') }}</th>
                <th>{{ $t('profilePage.th.period') }}</th>
                <th>CPU</th>
                <th>RAM</th>
                <th>Boot Disk</th>
              </thead>
              <tbody>
              <tr v-for="(item) in props.item.productWriteoffs" class="product-instance-billing">
                <td>
                  <span :class="{'link': item.product.state === 'active'}" @click="goToProductInstance(item.product)">
                  {{ item.product.name || item.product_instance_id }}
                  </span>
                </td>
                <td>{{new Date(item.start_at).toLocaleString($i18n.locale) }} - {{new Date(item.end_at).toLocaleString($i18n.locale) }}</td>
                <td>
                  {{ $t('profilePage.count') }}: {{ item.billing_data.cpu.count }}<br>
                  {{ $t('profilePage.price') }}: {{ item.billing_data.cpu.price }} {{ item.billing_data.cpu.currency }}
                </td>
                <td>
                  {{ $t('profilePage.count') }}: {{ item.billing_data.ram.count }}<br>
                  {{ $t('profilePage.price') }}: {{ item.billing_data.ram.price }} {{ item.billing_data.ram.currency }}
                </td>
                <td>
                  {{ $t('profilePage.count') }}: {{ item.billing_data.boot_disk.count }}<br>
                  {{ $t('profilePage.price') }}: {{ item.billing_data.boot_disk.price }} {{ item.billing_data.boot_disk.currency }}
                </td>
              </tr>
              </tbody>

            </table>
          </div>



        </template>
        <template slot="pageText" slot-scope="props">
          {{ props.pageStart }} - {{ props.pageStop }} {{ $t('tablesCommon.pagination.of') }} {{ props.itemsLength }}
        </template>
      </v-data-table>

    </v-dialog>

    <v-dialog v-model="showPaymentDialog" max-width="670px">
      <div class="close-btn"
           @click.stop="showPaymentDialog = !showPaymentDialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
          <path class="cross" fill="none" fill-rule="evenodd" stroke="#FF3200" stroke-width="2" d="M5.5 5.5L10 10 5.5 5.5 1 10l4.5-4.5zm0 0L1 1l4.5 4.5L10 1 5.5 5.5z"/>
        </svg>
      </div>
      <div class="dialog-title mmb-2">
        {{ $t('profilePage.balanceReplenishment') }}
      </div>
      <v-form ref="form" lazy-validation>
        <v-layout>
          <v-flex>
            <v-text-field
              type="number"
              class="mmt-3"
              :label="$t('profilePage.amount')"
              v-model.number="paymentAmount"
              :rules="amountRules"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>

      </v-form>

      <div class="text-xs-right">
        <button class="simple-btn mmt-4 mmr-2" @click.stop="showPaymentDialog = !showPaymentDialog">{{ $t('button.cancel') }}</button>

        <div class="width-170 mmr-4 text-xs-center d-inline" v-if="paymentPreloader">
          <img width=45px height=45px src="~assets/images/preloader.svg">
        </div>
        <template v-else>
          <button class="boodet-btn width-170 mmt-4" @click="pay">{{ $t('button.deposit') }}</button>
        </template>
      </div>

      <form id="paymentForm" name="live_update" method="POST" :action="paymentForm.action_url" target="_blank">
        <input name="MERCHANT" type="hidden" :value="paymentForm.merchant" id="MERCHANT">
        <input name="ORDER_REF" type="hidden" :value="paymentForm.order_ref" id="ORDER_REF">
        <input name="ORDER_DATE" type="hidden" :value="paymentForm.order_date" id="ORDER_DATE">
        <input name="ORDER_PNAME[]" type="hidden" :value="paymentForm.order_pname" id="ORDER_PNAME0">
        <input name="ORDER_PCODE[]" type="hidden" :value="paymentForm.order_pcode" id="ORDER_PCODE0">
        <input name="ORDER_PRICE[]" type="hidden" :value="paymentForm.order_price" id="ORDER_PRICE0">
        <input name="ORDER_QTY[]" type="hidden" :value="paymentForm.order_qty" id="ORDER_QTY0">
        <input name="ORDER_VAT[]" type="hidden" :value="paymentForm.order_vat" id="ORDER_VAT0">
        <input name="PRICES_CURRENCY" type="hidden" :value="paymentForm.prices_currency" id="PRICES_CURRENCY">
        <input name="ORDER_HASH" type="hidden" :value="paymentForm.order_hash" id="ORDER_HASH">
        <input name="BILL_FNAME" type="hidden" :value="paymentForm.bill_fname" id="BILL_FNAME">
        <input name="BILL_LNAME" type="hidden" :value="paymentForm.bill_lname" id="BILL_LNAME">
        <input name="BILL_BANKACCOUNT" type="hidden" :value="paymentForm.bill_bankaccount" id="BILL_BANKACCOUNT">
        <input name="BILL_EMAIL" type="hidden" :value="paymentForm.bill_email" id="BILL_EMAIL">
        <input name="BILL_PHONE" type="hidden" :value="paymentForm.bill_phone" id="BILL_PHONE">
        <input name="LANGUAGE" type="hidden" :value="paymentForm.language" id="LANGUAGE">
        <input name="TESTORDER" type="hidden" value="TRUE" id="TESTORDER">
      </form>

    </v-dialog>


  </div>
</template>

<script>
  import _ from 'lodash';
  import { makeErrorObject } from '../../libraries/helpers';
  import { validationFunctions } from '../../libraries/validation_functions'

  export default {
    data () {
      return {
        paymentPreloader: false,
        showStatementDialog: false,
        showPaymentDialog: false,
        isLoadingWriteoffDetails: true,
        headers: [
          { text: this.$t('profilePage.th.date'), align: 'left',  value: 'writeoff_month'},
          { text: '', sortable: false, value: 'writeoff_month'},
          { text: this.$t('profilePage.th.amount') + ", \u20BD", align: 'right', value: 'amount_sum'},
        ],
        headers2: [
          { text: this.$t('profilePage.th.period'),  value: 'start_date'},
          { text: this.$t('profilePage.th.amount'), align: 'right', value: 'amount'}
        ],
        currentDate: '',
        rowPerPageItems: [5, 10, 25, 50, {"text":this.$t('tablesCommon.pagination.all'),"value":-1}],
        productInstances: [],
        paymentAmount: '',
        paymentForm: {
          action_url: '',
          merchant: '',
          order_ref: '',
          order_date: '',
          order_pname: '',
          order_pcode: '',
          order_price: '',
          order_qty: '',
          order_vat: '',
          order_hash: '',
          prices_currency: 'RUB',
          bill_fname: '',
          bill_lname: '',
          bill_bankaccount: '',
          bill_email: '',
          bill_phone: '',
          language: 'ru'
        },
        amountRules: [
          validationFunctions.require.bind(this),
          validationFunctions.minValue100.bind(this)
        ],

      }
    },

    computed: {
      writeoffs() {
        return this.$store.state.writeoffs
      },

      currentWriteoffs() {
        return this.$store.state.currentWriteoffs
      },

      balance() {
        return Math.floor(this.$store.state.client.current_balance_cents/100);
      }
    },

    methods: {
      showWriteoffsDetailed(date) {
        this.currentDate = date;
        this.showStatementDialog = true;
        this.isLoadingWriteoffDetails = true;

        this.$store.dispatch('getCurrentWriteoffs', {clientId: this.$store.state.client.id, date: date}).then(response => {
          if (response.status === 200) {

            this.$store.dispatch('getProducts').then(response2 => {
              if (response2.status === 200) {
                this.isLoadingWriteoffDetails = false;

                let result = response.data.writeoffs.map(function(writeoff) {
                  writeoff.start_date = writeoff.start_date;
                  writeoff.end_date = writeoff.end_date;

                  let productWriteoffs = [];

                  _.forEach(writeoff.billing, function(item) {
                    _.forEach(item.states, function(instance) {
                      productWriteoffs.push(instance);
                    })
                  });

                  let productInstances = response2.data.product_instances;

                  _.forEach(productWriteoffs, function(item) {
                    item.product =  _.find(productInstances, function(item2) {
                      return item2.id == item.product_instance_id
                    }) || {name: '-', state: ''};
                  }.bind(this));

                  writeoff.productWriteoffs = productWriteoffs;

                  return writeoff
                }.bind(this))

                this.$store.commit('setCurrentWriteoffs', result)

              } else {
                this.$toast.error(makeErrorObject(response))
              }
            })

          } else {
            this.$toast.error(makeErrorObject(response))
          }
        })
      },
      goToProductInstance(product) {
        if (product.state === 'active') {
          this.$store.commit('setProduct', product);
          this.$router.push({ path: '/products/' + product.id });
        }
      },
      pay() {
        let requestData = {
          client_id: this.$store.state.client.id,
          payment: {
            amount_cents: this.paymentAmount * 100
          }
        }

        this.paymentPreloader = true;

        this.$store.dispatch('createPayment', requestData)
          .then(response => {
            this.paymentPreloader = false;
            if (response.status === 201) {
              this.$store.commit('setPaymentData', response.data);
              this.updatePaymentForm(response.data);
              this.$nextTick(() => {
                document.getElementById('paymentForm').submit();
              })
            } else {
              this.$toast.error(makeErrorObject(response))
            }

          })
      },

      updatePaymentForm(data) {
        this.paymentForm.action_url =  data.details.url;
        this.paymentForm.merchant =  data.details.merchant;
        this.paymentForm.order_ref =  data.payment.id;
        this.paymentForm.order_date =  data.details.order_date;
        this.paymentForm.order_pname =  data.details.product;
        this.paymentForm.order_pcode =  data.payment.id;
        this.paymentForm.order_price =  data.payment.formatted_amount;
        this.paymentForm.order_qty =  data.details.order_qty[0];
        this.paymentForm.order_vat =  data.details.order_vat[0];
        this.paymentForm.order_hash =  data.payment.signature;
        this.paymentForm.prices_currency =  data.payment.currency;
        this.paymentForm.bill_fname =  data.user.first_name;
        this.paymentForm.bill_lname =  data.user.last_name;
        this.paymentForm.bill_email =  data.user.email;
        this.paymentForm.bill_phone =  data.user.phone;
        this.paymentForm.language =  this.$i18n.locale;
      }
    },

    mounted() {
      this.$store.dispatch('getWriteoffs', this.$store.state.client.id).then(response => {
        if (response.status === 200) {
          this.$store.commit('setWriteoffs', response.data)
        } else {
          this.$toast.error(makeErrorObject(response))
        }
      })
    }
  }

</script>

<style lang="stylus">

  .product-instance-billing {
    td {
      font-size 14px !important
    }

  }

  .th-left {
    th {
      text-align left
    }
  }
  table.table tbody td, table.table tbody th {
    height: 24px;
  }

  .balance-block {
    display flex
    flex-direction column

    .font-xxl {
      line-height 1.3
    }
  }

  .balance-label {
    font-size 10px
    letter-spacing 0.5px
    opacity 0.5
  }

  .payU-btn-row {
    display flex
  }

</style>
