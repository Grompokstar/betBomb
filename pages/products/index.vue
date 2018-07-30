<template>
  <v-container>
    <v-layout row class="mmt-3">
      <v-flex xs6 class="dd-flex" align-center justify-start>
        <div class="display-1 medium mmr-3">{{ $t('productInstancesTable.title') }}</div>
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
        <nuxt-link to="products/add" class="boodet-btn">{{ $t('productInstancesTable.titleButton') }}</nuxt-link>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-data-table
        :headers="headers"
        :items="products"
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
          <tr :class="getChipColor(props.item)">
            <td>
              <span class="product-name" :class="{link: checkProduct(props.item) }" @click="goToProductInstance(props.item)">{{ props.item.name || '—' }}</span><br>
            </td>
            <td>{{ getProductType(props.item) }}</td>
            <td class="text-xs-right">{{ priceFunction(props.item.machine) }}</td>
            <td>{{ new Date(props.item.created_at).toLocaleString($i18n.locale, {day:'numeric', month:'short', year:'numeric', hour:'numeric', minute:'numeric'}) }}</td>
            <td class="product-status">{{ getStatus(props.item) }}</td>
            <td>
              <div v-if="checkProduct(props.item)">
                <v-menu offset-y bottom v-if="props.item.state === 'active'">
                  <div class="menu-activator blue-color" slot="activator">{{ $t('productInstancesTable.actions') }}</div>
                  <ul class="menu-list">
                    <li @click="goToResize(props.item.id)">{{ $t('productInstancesTable.resize') }}</li>
                    <li @click="confirmDeleteProduct(props.item.id)">{{ $t('productInstancesTable.delete') }}</li>
                  </ul>
                </v-menu>
              </div>
              <div v-else-if="props.item.state !== 'processing'">
                <v-menu offset-y bottom>
                  <div class="menu-activator blue-color" slot="activator">{{ $t('productInstancesTable.actions') }}</div>
                  <ul class="menu-list">
                    <li @click="confirmDeleteProduct(props.item.id)">{{ $t('productInstancesTable.delete') }}</li>
                  </ul>
                </v-menu>
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
      <v-dialog v-model="confirmDeleteProductDialog" max-width="670px">
        <div class="close-btn"
             @click.stop="confirmDeleteProductDialog = !confirmDeleteProductDialog">
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

        <div>
          <button class="boodet-btn width-170 mmt-4 mmr-3" @click="deleteProduct">{{ $t('button.confirm') }}</button>
          <button class="mmt-4 simple-btn" @click.stop="confirmDeleteProductDialog = !confirmDeleteProductDialog">{{ $t('button.cancel') }}</button>
        </div>
      </v-dialog>
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
          { text: this.$t('productInstancesTable.tableTHs.name'), align: 'left', value: 'name'},
          { text: this.$t('productInstancesTable.tableTHs.type'), align: 'left',  value: 'product_id'},
          { text: this.$t('productInstancesTable.tableTHs.fee'), align: 'right', sortable: false, value: '' },
          { text: this.$t('productInstancesTable.tableTHs.creationDate'), sortable: 'default', value: 'created_at' },
          { text: this.$t('productInstancesTable.tableTHs.status'), align: 'left', value: 'state'},
          { text: '', sortable: false }
        ],
        pagination: {'sortBy': 'created_at', 'descending': true, 'rowsPerPage': 25},
        machineStatuses: {
          RUNNING: this.$t('productStatuses.running'),
          HALTED: this.$t('productStatuses.halted'),
          active: this.$t('productStatuses.active'),
          processing: this.$t('productStatuses.processing'),
          failed: this.$t('productStatuses.failed'),
        },
        priceFunction: calculatePrice,
        rowPerPageItems: [5, 10, 25, 50, {"text":this.$t('tablesCommon.pagination.all'),"value":-1}],
        confirmDeleteProductDialog: false,
        deletingProduct: null,
        haveProcessingProducts: false

      }
    },

    computed: {
      products() {
        return this.$store.state.products
      }
    },

    methods: {
      showSearchInput() {
        this.isShowSearchInput = true
      },

      getChipColor(product) {
        if (product.machine) {
          if (product.state === 'processing' || product.state === "failed") {
            return product.state
          } else {
            return product.machine.status;
          }
        } else {
          return product.state;
        }
      },
      goToResize(productId) {
        this.$store.commit('setActiveProductPage', 'resize');
        this.$router.push({ path: '/products/' + productId });
      },
      goToProductInstance(product) {
        let machine = _.find(product.resources, function(resource) {
          return resource.type === 'machine'
        });

        if (product.state === 'active' && machine) {
          this.$store.commit('setProduct', product);
          this.$router.push({ path: '/products/' + product.id });
        }
      },
      getStatus(product) {
        if (product.machine) {
          if (product.state === "processing" || product.state === "failed") {
            return this.machineStatuses[product.state];
          } else {
            return this.machineStatuses[product.machine.status];
          }
        } else {
          return this.machineStatuses[product.state];
        }
      },
      checkProduct(product) {
        let machine = _.find(product.resources, function(resource) {
          return resource.type === 'machine'
        });

        if (machine && machine.state === "RUNNING"  || product.state === 'active' && machine) {
          return true
        } else {
          return false
        }
      },
      getProductType(product) {
        let productTypes = {
          machine: this.$t('productTypes.virtualMachine'),
          cloud_space: this.$t('productTypes.cloudSpace')
        };
        let result = '';

        _.forEach(product.resources, function(resource, index) {
          result += productTypes[resource.type];
          if (index < product.resources.length - 1) {
            result += ', '
          }

        });

        return result || '—';

      },
      confirmDeleteProduct(productId) {
        this.deletingProduct = productId;
        this.confirmDeleteProductDialog = true;
      },

      deleteProduct() {
        this.confirmDeleteProductDialog = false;
        this.$store.dispatch('productInstanceDelete', this.deletingProduct).then(response => {
          if (response.status === 200) {
            this.$toast.success({title: '', message: this.$t('productPage.notifications.deleteProduct')});

            this.$store.dispatch('getProducts').then(response => {
              if (response.status === 200) {
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
                this.$store.commit('setProducts', mapedResponse)
              } else {
                this.$toast.error(makeErrorObject(response))
              }
            })

          } else {
            this.$toast.error(makeErrorObject(response))
          }
        })
      }
    },

    mounted() {
      this.$store.dispatch('getProducts').then(response => {
        if (response.status === 200) {
          this.isLoadingProducts = false;
          let filteredData = _.filter(response.data.product_instances, function(item) {
            return item.state !== 'deleted';
          });

          this.haveProcessingProducts = _.find(response.data.product_instances, function(item) {
            return item.state === 'processing';
          });
          let mapedResponse = filteredData.map(function(product) {
            product.created_at = product.created_at;
            product.client_name = this.$store.state.client.name;
            product.machine = _.find(product.resources, function(item) {
              return item.type === 'machine'
            })

            return product;
          }.bind(this))
          this.$store.commit('setProducts', mapedResponse)
        } else {
          this.$toast.error(makeErrorObject(response))
        }
      });

      setTimeout(function getProducts() {
        if (this.haveProcessingProducts) {
          this.$store.dispatch('getProducts').then(response => {
            if (response.status === 200) {
              this.isLoadingProducts = false;

              this.haveProcessingProducts = _.find(response.data.product_instances, function(item) {
                return item.state === 'processing';
              });

              let mapedResponse = response.data.product_instances.map(function(product) {
                product.created_at = product.created_at;
                product.client_name = this.$store.state.client.name;
                product.machine = _.find(product.resources, function(item) {
                  return item.type === 'machine'
                })

                return product;
              }.bind(this))
              this.$store.commit('setProducts', mapedResponse)
            } else {
              this.$toast.error(makeErrorObject(response))
            }
          });
        }


        setTimeout(getProducts.bind(this), 30000);

      }.bind(this), 30000)
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
