<template>
  <div class="product-navigation">
    <div class="nav-item" :class="{ active:  currentPage === 'settings'}" @click="setActivePage('settings')">
      {{ $t('profilePage.nav.settings') }}
    </div>
    <div class="nav-item disabled" :class="{ active:  currentPage === 'bonus'}" >
      {{ $t('profilePage.nav.bonuses') }}
    </div>
    <div class="nav-item disabled" :class="{ active:  currentPage === 'notifications'}" >
      {{ $t('profilePage.nav.notifications') }}
    </div>
    <v-divider class="mmy-2"></v-divider>
    <div class="nav-item" :class="{ active:  currentPage === 'clients'}" @click="setActivePage('clients')">
      {{ $t('profilePage.nav.accounts') }}
    </div>
    <div class="nav-item" :class="{ active:  currentPage === 'payment'}" @click="setActivePage('payment')">
      {{ $t('profilePage.nav.balance') }}
    </div>
    <div class="nav-item disabled" :class="{ active:  currentPage === 'tickets'}" >
      {{ $t('profilePage.nav.support') }}
    </div>
  </div>
</template>

<script>

  export default {
    computed: {
      currentPage() {
        return this.$store.state.activeProfilePage;
      },
    },
    methods: {
      setActivePage(page) {
        this.$store.commit('setActiveProfilePage', page);
      }
    }
  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

</style>
