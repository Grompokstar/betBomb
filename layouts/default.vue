<template>
  <v-app class="boodet-theme">
    <v-content v-if="showApp">
        <nuxt />
    </v-content>
  </v-app>
</template>

<script>
  import DeHeader from '~/components/DeHeader.vue'

  export default {

    components: {
      DeHeader
    },

    /*data() {
      return {
        showApp: this.$store.state.showApp
      }
    },*/

    computed: {
      showApp() {
        return this.$store.state.showApp
      }
    }
  }
</script>



