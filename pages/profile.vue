<template>
  <v-container>
    <div class="product-name-row mmt-6 mmb-5">
      <div class="product-name">
        <div class="font-xxl bold mmb-1">
          Профиль
        </div>
      </div>
    </div>

    <v-layout>
      <v-flex xs2>
        <profile-navigation></profile-navigation>
      </v-flex>
      <v-flex xs10>
        <component :is="'profile-' + profilePage + '-page'" :user="user"></component>
      </v-flex>
    </v-layout>

  </v-container>
</template>


<script>
  import ProfileNavigation from '~/components/profile_page/ProfileNavigation.vue';
  import ProfileSettingsPage from '~/components/profile_page/ProfileSettingsPage.vue';
  import ProfilePaymentPage from '~/components/profile_page/ProfilePaymentPage.vue';
  import ProfileClientsPage from '~/components/profile_page/ProfileClientsPage.vue';

  export default {
    components: {
      ProfileNavigation,
      ProfileSettingsPage,
      ProfilePaymentPage,
      ProfileClientsPage
    },

    data () {
      return {

      }
    },

    computed: {
      user() {
        return this.$store.state.user
      },
      profilePage() {
        return this.$store.state.activeProfilePage
      },

    }


  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

  .product-name-row {
    display flex

    .product-name {
      margin-right auto
    }

    .server-switch-state {
      flex-basis 58px
      flex-grow 0
      margin-top 10px

      .switch {
        margin-left auto

        .input-group__input {
          justify-content flex-end
        }
      }

      .product-state-switch-string {
        font-size 14px
        color $font-color-gray
        opacity 0.5
      }
    }
  }

  .product-page-content {
    border 1px solid rgba(0,0,0,0.05)
    padding 25px 30px 30px
    position relative

    .product-price {
      position absolute
      top 25px
      right 30px
      font-size 32px
      font-weight 700
    }

    .page-title {
      font-size 20px
      font-weight 700
      line-height 1.4
      letter-spacing 0.3px
      margin-bottom 18px
    }

    .page-description {
      color $font-color-gray
      font-size 14px
      max-width 570px
    }
  }
</style>
