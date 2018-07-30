<template>
  <div id="header">
    <v-container>
      <v-layout>
        <div class="nav">
          <nuxt-link to="/events"
                     class="medium">
            <v-btn flat>События</v-btn>
          </nuxt-link>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  export default {
    beforeCreate() {

    },
    mounted() {

    },
    data () {
      return {
        notifActions: [
          { title: 'Все уведомления', to: '/' }
        ]
      }
    },

    computed: {
    },

    methods: {
    }
  }

</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .boodet-theme {
    #header {
      background-color $blue-brand-color
      height 74px

      .container {
        padding 0 16px

        .layout {
          height 74px
          align-items center
        }
      }

      .main-logo {
        height 46px
        margin-right 35px
      }

      .nav {
        height 100%

        .v-btn {
          height 100%
          margin 0
          font-size 16px
          color: #fff
          text-transform none
          font-family "Ubuntu", Helvetica, Arial, sans-serif
        }

        a.nuxt-link-exact-active {
          .v-btn {
            background-color rgba(255, 255, 255, 0.2)!important
          }
        }
      }
    }
  }

</style>
