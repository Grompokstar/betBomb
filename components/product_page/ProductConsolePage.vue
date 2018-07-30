<template>
  <div class="product-page-content">
    <div class="page-title mmb-4">
      {{ $t('productPage.nav.console') }}
    </div>
    <div class="sans-pro dd-flex wrap">
      <div class="mmr-4 mmb-3">
        <button class="boodet-btn" @click="sendCtrAltDel">Send Ctrl+Alt+Del</button>
      </div>
      <div class="mmr-4 mmb-3">
        <span class="blue-brand-color">IP address</span><br>
        <span>{{ machineIP }}</span>
      </div>
      <div class="mmr-4 mmb-3">
        <span class="link" @click="sendText(machineLogin)">Initial login</span><br>
        <span>{{ machineLogin }}</span>
      </div>
      <div class="mmb-3">
        <span class="link" @click="sendText(machinePassword)">Initial password</span><br>
        <span>{{ machinePassword }}</span>
      </div>
    </div>

    <div id="noVNC-console">
    </div>

  </div>
</template>

<script>

  import { makeErrorObject } from '../../libraries/helpers'
  import _ from 'lodash'

  export default {

    mounted() {
      let machineId = _.find(this.$store.state.currentProduct.resources, function(resource) {
        return resource.type === 'machine'
      }).id
      this.$store.dispatch('getConsoleUrl', machineId)
        .then(response => {
          if (response.status === 200) {
            let consoleUrl = response.data.machine.console_url;
            this.machineLogin = response.data.machine.ssh_login;
            this.machinePassword = response.data.machine.ssh_password;
            let urlArray = consoleUrl.split('/vnc_auto.html');
            let host = urlArray[0].substr(8);
            let vncUrl = 'wss://' + host + '/websockify' + urlArray[1];

            this.rfb = this.$rfb.newRFB(document.getElementById('noVNC-console'), vncUrl, {scaleViewport: true});

          } else {
            this.$toast.error(makeErrorObject(response))
          }

        })
    },
    data () {
      return {
        productId: this.$route.params.id,
        product: this.$store.state.currentProduct,
        rfb: null,
        machineLogin: '',
        machinePassword: ''
      }
    },

    computed: {
      machineIP() {
        return this.$store.state.currentProduct.machine.local_ip_address ?
          this.$store.state.currentProduct.machine.local_ip_address :
          ''
      },

    },

    methods: {
      sendText(text) {
        let rfb = this.rfb;
        function sendchar() {
          var chr = text[0];
          text = text.slice(1);
          rfb.sendKey(chr.charCodeAt(0));
          if (text.length > 0) {
            setTimeout(sendchar, 50);
          }
        }
        sendchar();
      },

      sendCtrAltDel() {
        this.rfb.sendCtrlAltDel()
      }

    }
  }

</script>

<style lang="stylus">
  #noVNC-console {

    >div {
      background-color #fff!important
      display block!important
    }
  }
</style>
