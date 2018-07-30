<template>
  <div class="product-page-content">
    <!--<div class="product-price">{{ product.price }}&nbsp;&#8381;</div>-->
    <div class="page-title">
      {{ $t('productPage.network.title') }}
    </div>
    <div class="page-description mmb-4">
      {{ $t('productPage.network.pageDescription') }}
    </div>
    <v-layout>
      <v-flex>
        <div class="font-xxl">
          {{ $t('productPage.network.portForwardTable.title') }}
        </div>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex class="text-xs-right">
        <button class="simple-btn" @click="createPortDialog = !createPortDialog">{{ $t('productPage.network.portForwardTable.addPortBtn') }}</button>
      </v-flex>
    </v-layout>


    <v-layout>
      <v-data-table
        :headers="headers"
        :items="networkPortsForwarded"
        :loading="isLoadingPorts"
        hide-actions
        disable-initial-sort
        :no-data-text="$t('productInstancesTable.noData')"
        :rows-per-page-text="$t('tablesCommon.pagination.rowPerPage')"
        class="width-100 de-table mmt-2 mmb-3"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.cloud_public_ip }}</td>
          <td class="text-xs-center">{{ props.item.cloud_public_port }}</td>
          <td class="text-xs-center">{{ product.name }} ({{ props.item.cloud_local_ip }})</td>
          <td class="text-xs-center">{{ props.item.cloud_local_port }}</td>
          <td class="text-xs-center">{{ props.item.cloud_protocol }}</td>
          <td class="text-xs-right">
            <v-menu offset-y bottom>
              <div class="menu-activator blue-color" slot="activator">{{ $t('productInstancesTable.actions') }}</div>
              <ul class="menu-list">
                <li @click="editPort(props.item)">{{ $t('productPage.network.portForwardTable.actionEdit') }}</li>
                <li @click="confirmDeletePort(props.item)">{{ $t('productInstancesTable.delete') }}</li>
              </ul>
            </v-menu>
          </td>
        </template>
      </v-data-table>
    </v-layout>

    <!--<div class="font-xxl mmb-2">
      Ширина канала
    </div>

    <v-layout class="mmb-1">
      <v-flex md5 class="slider-form-group without-label mmt-3">
        <v-text-field
          v-model="computedBandwidth"
          label="Ширина канала"
          disabled
        ></v-text-field>
        <v-slider v-model="sliderBandwidthValue" max="9"></v-slider>
      </v-flex>
    </v-layout>
    <button class="boodet-btn width-170 mmb-5">Сохранить</button>

    <div class="font-xxl mmb-2">
      Дополнительный IP
    </div>
    <button class="boodet-btn width-170">Купить</button>-->

    <v-dialog v-model="createPortDialog" max-width="670px">
      <div class="close-btn"
           @click.stop="createPortDialog = !createPortDialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
          <path class="cross" fill="none" fill-rule="evenodd" stroke="#FF3200" stroke-width="2" d="M5.5 5.5L10 10 5.5 5.5 1 10l4.5-4.5zm0 0L1 1l4.5 4.5L10 1 5.5 5.5z"/>
        </svg>
      </div>
      <div class="dialog-title mmb-2">
        {{ $t('productPage.network.createForm.title') }}
      </div>
      <v-form v-model="validCreatePortForm" ref="form" lazy-validation>
        <div class="bordered-block__15-20 mmb-2">
          <div class="font-xl bold mmb-2">
            {{ $t('productPage.network.createForm.source') }} <span class="default-text mml-1">ip {{cloudSpace.cloud_public_ip_address}}</span>
          </div>

          <v-layout>
            <v-flex xs12 md6 class="form-group">
              <v-text-field
                type="number"
                class="mmt-3"
                :label="$t('productPage.network.createForm.port')"
                v-model.number="createPortForm.cloud_public_port"
                :rules="requireRules"
                number
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6 class="form-group">
              <v-select class="mmt-3"
                        :items="selectProtocol"
                        v-model="createPortForm.cloud_protocol"
                        :label="$t('productPage.network.createForm.protocol')"
                        :rules="requireRule"
                        autocomplete>
              </v-select>
            </v-flex>
          </v-layout>
        </div>

        <div class="bordered-block__15-20">
          <div class="font-xl bold mmb-2">
            {{ $t('productPage.network.createForm.destination') }} <span class="default-text mml-1">VM: {{product.name}}</span>
          </div>

          <v-layout>
            <v-flex xs12 md6 class="form-group">
              <v-text-field
                class="mmt-3"
                type="number"
                :label="$t('productPage.network.createForm.port')"
                v-model.number="createPortForm.cloud_local_port"
                :rules="requireRules"
                number
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
        </div>
      </v-form>


      <div class="width-270 mmt-4 text-xs-center" v-if="createPortPreloader">
        <img width=45px height=45px src="~assets/images/preloader.svg">
      </div>

      <div class="text-xs-center" v-else>
        <button  class="boodet-btn width-270 mmt-4"
                 @click="createPort"
                 :disabled="!validCreatePortForm">{{$t('button.save')}}</button>
      </div>

    </v-dialog>

    <v-dialog v-model="confirmDeletePortDialog" max-width="670px">
      <div class="close-btn"
           @click.stop="confirmDeletePortDialog = !confirmDeletePortDialog">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11">
          <path class="cross" fill="none" fill-rule="evenodd" stroke="#FF3200" stroke-width="2" d="M5.5 5.5L10 10 5.5 5.5 1 10l4.5-4.5zm0 0L1 1l4.5 4.5L10 1 5.5 5.5z"/>
        </svg>
      </div>

      <div class="dialog-title mmb-2">
        {{ $t('dialogs.confirmation') }}
      </div>
      <div class="sans-pro font-lg">
        {{ $t('dialogs.confirmRequest') }}
      </div>

      <v-layout>
        <div class="width-170 text-xs-center mmt-4 mmr-3" v-if="deletePortPreloader">
          <img width=45px height=45px src="~assets/images/preloader.svg">
        </div>
        <template v-else>
          <button class="boodet-btn width-170 mmt-4 mmr-3" @click="deletePort(deletingPort)">{{ $t('button.confirm') }}</button>
        </template>
        <button class="mmt-4 simple-btn" @click.stop="confirmDeletePortDialog = !confirmDeletePortDialog">{{ $t('button.cancel') }}</button>
      </v-layout>
    </v-dialog>

  </div>
</template>

<script>
  import { validationFunctions } from '../../libraries/validation_functions';
  import { makeErrorObject, calculatePrice } from '../../libraries/helpers'

  export default {
    mounted() {
      this.sliderBandwidthValue = this.bandwidthArray.indexOf(this.$store.state.currentProduct.machine.bandwidth);

      this.$store.dispatch('getCloudSpace', this.$store.state.currentProduct.machine.cloud_space_id).then(response => {
        if (response.status === 200) {
          this.cloudSpace = response.data.cloud_space
        } else {
          this.$toast.error(makeErrorObject(response));
        }
      });

      this.updatePortsList();

    },

    data () {
      return {
        isLoadingPorts: true,
        headers: [
          { text: 'ip', align: 'left', sortable: false, value: 'cloud_public_ip'},
          { text: this.$t('productPage.network.portForwardTable.THs.port'), align: 'center',  sortable: false, value: 'cloud_public_port'},
          { text: this.$t('productPage.network.portForwardTable.THs.vm'), align: 'center',  sortable: false, value: 'cloud_local_ip' },
          { text: this.$t('productPage.network.portForwardTable.THs.port'), align: 'center', sortable: false, value: 'cloud_public_port'},
          { text: this.$t('productPage.network.portForwardTable.THs.protocol'), align: 'center', value: 'cloud_protocol' },
          { text: '', align: 'right', sortable: false, value: 'cloud_protocol' }
        ],
        bandwidthArray: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        sliderBandwidthValue: 0,
        createPortForm: {
          cloud_public_port: '',
          cloud_local_port: '',
          cloud_protocol: 'tcp'
        },
        validCreatePortForm: false,
        requireRules: [
          validationFunctions.require.bind(this)
        ],
        cloudSpace: {
          ip: ''
        },
        selectProtocol: [
          {
            text: 'TCP',
            value: 'tcp'
          },
          {
            text: 'UDP',
            value: 'udp'
          }
        ],
        createPortDialog: false,
        confirmDeletePortDialog: false,
        deletingPort: {},
        updatingPort: null,
        createPortPreloader: false,
        deletePortPreloader: false
      }
    },

    computed: {
      networkPortsForwarded() {
        return this.$store.state.currentProductPorts;
      },
      product() {
        return this.$store.state.currentProduct
      },
      computedBandwidth: function() {
        return this.bandwidthArray[this.sliderBandwidthValue] + ' Мбит/с';
      },
    },

    methods: {
      createPort () {
        if (this.$refs.form.validate()) {
          this.createPortPreloader = true;
          let requestData = {port: Object.assign(
            { machine_id: this.product.machine.id,
              cloud_space_id: this.product.machine.cloud_space_id },
            this.createPortForm
          )};

          if (this.updatingPort) {
            this.$store.dispatch('updateVMPort', {requestData: requestData, portId: this.updatingPort.id} )
              .then(response => {
                this.updatingPort = null;
                this.createPortForm.cloud_public_port = '';
                this.createPortForm.cloud_local_port = '';
                this.createPortForm.cloud_protocol = 'tcp';

                this.createPortDialog = false;
                this.createPortPreloader = false;
                if (response.status === 200) {
                  this.updatePortsList();
                  this.$toast.success({title: '', message: this.$t('productPage.notifications.editPort')});
                } else {
                  this.$toast.error(makeErrorObject(response))
                }
              });
          } else {
            this.$store.dispatch('createVMPort', requestData )
              .then(response => {
                this.createPortDialog = false;
                this.createPortPreloader = false;
                this.createPortForm.cloud_public_port = '';
                this.createPortForm.cloud_local_port = '';
                this.createPortForm.cloud_protocol = 'tcp';
                if (response.status === 201) {
                  this.updatePortsList();
                  this.$toast.success({title: '', message: this.$t('productPage.notifications.createPort')});
                } else {
                  this.$toast.error(makeErrorObject(response))
                }
              });
          }

        }
      },

      confirmDeletePort(portData) {
        this.deletingPort = portData;
        this.confirmDeletePortDialog = true;
      },

      updatePortsList() {
        this.$store.dispatch('getVMPorts', this.$store.state.currentProduct.machine.id).then(response => {
          if (response.status === 200) {
            this.isLoadingPorts = false;
            this.$store.commit('setVMPorts', response.data.ports);
          } else {
            this.$toast.error(makeErrorObject(response));
          }
        });
      },

      deletePort (portData) {
        this.deletePortPreloader = true;
        this.$store.dispatch('deleteVMPort', portData )
          .then(response => {
            this.deletePortPreloader = false;
            if (response.status === 200) {
              this.confirmDeletePortDialog = false;
              this.updatePortsList();
              this.$toast.success({title: '', message: this.$t('productPage.notifications.deletePort')});
            } else {
              this.confirmDeletePortDialog = false;
              this.$toast.error(makeErrorObject(response))
            }
          })
      },

      editPort (portData) {
        this.updatingPort = portData;
        this.createPortForm.cloud_public_port = portData.cloud_public_port;
        this.createPortForm.cloud_local_port = portData.cloud_local_port;
        this.createPortForm.cloud_protocol = portData.cloud_protocol;

        this.createPortDialog = true;
      }
    }
  }

</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .delete-btn {

  }

</style>