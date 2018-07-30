<template>
  <v-container class="card-list">
    <v-layout mmt-5 mmb-1>
      <v-flex xs12 class="font-xxl bold">
        {{ $t('createProduct') }}
      </v-flex>
    </v-layout>

    <v-layout row wrap justify-start>
      <v-flex v-for="item in productTemplates" :key="item.id">
        <nuxt-link :to="'/products/create?product_id=' + item.id" >
          <v-card class="serverConfig">
            <div class="title mmb-1">
              {{item.name}}
            </div>
            <div class="price mmb-2" v-if="item.type === 'vm' || item.type === 'example'">
              {{ $t('from') }} 442&nbsp;<span class="ruble">&#8381; / {{ $t('month') }}</span>
            </div>
            <div class="price mmb-2" v-else>
              {{ $t('from') }} 90&nbsp;<span class="ruble">&#8381; / {{ $t('month') }}</span>
            </div>
            <div class="parameters mmb-1">
              <v-layout>
                <v-flex v-if="item.type === 'vm' || item.type === 'example'">
                  {{ $t('anyConfig') }}
                </v-flex>
                <v-flex v-else>
                  {{ $t('cloudSpace') }}
                </v-flex>
                <!--<v-flex>
                  2 CPU
                </v-flex>
                <v-flex>
                  4 GB RAM
                </v-flex>
                <v-flex>
                  10 GB SSD
                </v-flex>-->
              </v-layout>
            </div>
            <div class="btn-row">
              <button class="boodet-btn width-170">{{ $t('button.order') }}</button>
            </div>
          </v-card>
        </nuxt-link>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  import axios from 'axios'

  export default {
    created() {
      this.$store.dispatch('getProductTemplates').then(response => {
        this.$store.commit('setProductTemplates', response)
      })
    },

    data () {
      return {
      }
    },

    computed: {
      productTemplates() {
        return this.$store.state.productTemplates
      }
    },

    methods: {

    }


  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .v-card.serverConfig {
    padding 20px 30px
    min-width: 320px
    cursor: pointer
    border-radius 0
    border: solid 1px $form-border-color;
    height 290px!important
    display flex
    flex-direction column
    box-shadow none

    &:hover {
      border-color #8d8c9e
    }

    .title {
      font-size 24px
      font-weight 400
    }

    .parameters {
      font-family 'Source Sans Pro', sans-serif;
      .flex {
        padding 0
      }
    }

    .price {
      font-size 24px
      color: $blue-brand-color
      font-weight 700
    }

    .btn-row {
      margin-top auto
      margin-bottom 10px
      display flex
      justify-content center
    }
  }

  .card-list {
    padding 5px

    .flex {
      padding 15px
      max-width 400px

      &:last-child {
        margin-right auto
      }
    }
  }
</style>
