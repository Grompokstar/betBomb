<template>
  <div class="product-navigation">
    <div class="nav-item" :class="{ active:  currentPage === 'index'}" @click="setActivePage('index')">
      {{ $t('productPage.nav.summary') }}
    </div>
    <div class="nav-item" :class="{ active:  currentPage === 'console'}" @click="setActivePage('console')">
      {{ $t('productPage.nav.console') }}
    </div>
    <div class="nav-item disabled" :class="{ active:  currentPage === 'monitoring'}">
      {{ $t('productPage.nav.monitor') }}
    </div>
    <div class="nav-item" :class="{ active:  currentPage === 'resize'}" @click="setActivePage('resize')">
      {{ $t('productPage.nav.resize') }}
    </div>
    <v-divider class="mmy-2"></v-divider>
    <div class="nav-item" :class="{ active:  currentPage === 'power'}" @click="setActivePage('power')">
      {{ $t('productPage.nav.power') }}
    </div>
    <div class="nav-item" :class="{ active:  currentPage === 'network'}" @click="setActivePage('network')">
      {{ $t('productPage.nav.network') }}
    </div>
    <div class="nav-item disabled" :class="{ active:  currentPage === 'disks'}" >
      {{ $t('productPage.nav.storage') }}
    </div>
    <v-divider class="mmy-2"></v-divider>
    <div class="nav-item disabled" :class="{ active:  currentPage === 'backup'}" >
      {{ $t('productPage.nav.snapshot') }}
    </div>
    <div class="nav-item disabled" :class="{ active:  currentPage === 'logs'}" >
      {{ $t('productPage.nav.logs') }}
    </div>
    <v-divider class="mmy-2"></v-divider>
    <div class="nav-item" :class="{ active:  currentPage === 'delete'}" @click="setActivePage('delete')">
      {{ $t('productPage.nav.remove') }}
    </div>
  </div>
</template>

<script>
  export default {

    data () {
      return {
      }
    },
    computed: {
      currentPage() {
        return this.$store.state.activeProductPage
      },
    },
    methods: {
      setActivePage(page) {
        this.$store.commit('setActiveProductPage', page);
      }
    }
  }
</script>

<style lang="stylus">
  @import "~assets/stylus/_variables";

</style>
